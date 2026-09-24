import { Component } from '@angular/core';
import { NavLink } from '../../../shared/components/nav-link/nav-link';
import { RouterLink } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { Select } from '../../../shared/components/select/select';
import { SelectOption } from '../../../shared/components/select-option/select-option';

@Component({
  imports: [NavLink, RouterLink, Button, Select, SelectOption],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {}
