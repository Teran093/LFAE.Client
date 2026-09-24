import { Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-nav-link',
  styleUrl: './nav-link.css',
  templateUrl: './nav-link.html',
})
export class NavLink {
  public navTitle = input<string>();
  public link = input<string>();

  protected isExternal = computed(() => /^https?:\/\//.test(this.link() ?? ''));
}
