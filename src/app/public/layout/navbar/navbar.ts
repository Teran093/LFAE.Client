import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { NavLink } from '../../../shared/components/nav-link/nav-link';
import { RouterLink } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { Select } from '../../../shared/components/select/select';
import { SelectOption } from '../../../shared/components/select-option/select-option';

/** Top bar of the public site: logo, main links, language selector and Donate button. */
@Component({
  imports: [NgOptimizedImage, NavLink, RouterLink, Button, Select, SelectOption],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {}
