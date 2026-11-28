// PostToolUse hook: formats the file Claude just edited or wrote with the project's Prettier.
// Receives the tool call as JSON on stdin. It never fails the edit: errors are only printed.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as prettier from 'prettier';

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

let input = '';
for await (const chunk of process.stdin) {
  input += chunk;
}

try {
  const { tool_input: toolInput } = JSON.parse(input);
  const file = toolInput?.file_path;
  if (!file) {
    process.exit(0);
  }

  // Skip files listed in .prettierignore and file types Prettier can't format
  const info = await prettier.getFileInfo(file, { ignorePath: join(projectDir, '.prettierignore') });
  if (info.ignored || !info.inferredParser) {
    process.exit(0);
  }

  const source = readFileSync(file, 'utf8');
  // `editorconfig: true` matches the Prettier CLI, which reads .editorconfig (e.g. single quotes)
  const config = (await prettier.resolveConfig(file, { editorconfig: true })) ?? {};
  // Keep each file's current line endings (CRLF or LF) unless the config sets them
  const formatted = await prettier.format(source, { endOfLine: 'auto', ...config, filepath: file });

  if (formatted !== source) {
    writeFileSync(file, formatted);
  }
} catch (error) {
  // A syntax error mid-edit is normal; Prettier will format the file on the next edit
  console.error(`[prettier hook] ${error instanceof Error ? error.message : error}`);
}
