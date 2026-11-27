import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';

/** Shell of the public site: navbar on top and the current page below. */
@Component({
  imports: [Navbar, RouterOutlet],
  selector: 'app-public-layout',
  styleUrl: './public-layout.css',
  templateUrl: './public-layout.html',
})
export class PublicLayout {}
