// Tells TypeScript that importing an .svg file gives its markup as a string.
// Place it in src/ (any .d.ts covered by tsconfig "include" works).
// Requires the esbuild loader in angular.json: "loader": { ".svg": "text" }
declare module '*.svg' {
  const content: string;
  export default content;
}
