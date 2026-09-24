import { Component, computed, contentChildren, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OverlayDirective } from '../../directives/overlay.directive';

@Component({
  imports: [RouterLink, RouterLinkActive, OverlayDirective],
  selector: 'app-nav-link',
  styleUrl: './nav-link.css',
  templateUrl: './nav-link.html',
})
export class NavLink {
  protected children = contentChildren(NavLink);

  public navTitle = input<string>();
  public link = input<string>();

  protected isExternal = computed(() => /^https?:\/\//.test(this.link() ?? ''));
}
