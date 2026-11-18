import { Component } from '@angular/core';
import { Select } from '../../../shared/components/select/select';
import { SelectOption } from '../../../shared/components/select-option/select-option';
import { NavLink } from '../../../shared/components/nav-link/nav-link';

@Component({
  imports: [Select, SelectOption, NavLink],
  selector: 'app-dashboard-navbar',
  styleUrl: './dashboard-navbar.css',
  templateUrl: './dashboard-navbar.html',
})
export class DashboardNavbar {}
