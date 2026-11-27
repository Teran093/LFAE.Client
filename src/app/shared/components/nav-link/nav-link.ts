import { Component, computed, contentChildren, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OverlayDirective } from '../../directives/overlay.directive';

/**
 * Navbar link. Nested `<app-nav-link>` elements become a dropdown.
 * Links that start with http(s) open in a new tab.
 */
@Component({
  imports: [RouterLink, RouterLinkActive, OverlayDirective],
  selector: 'app-nav-link',
  styleUrl: './nav-link.css',
  templateUrl: './nav-link.html',
})
export class NavLink {
  /** Nested links shown in the dropdown. */
  protected children = contentChildren(NavLink);

  public navTitle = input<string>();
  /** App route (e.g. "/events") or full external URL. */
  public link = input<string>();

  protected isExternal = computed(() => /^https?:\/\//.test(this.link() ?? ''));
}
