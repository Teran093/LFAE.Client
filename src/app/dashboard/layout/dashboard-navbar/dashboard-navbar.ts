import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Select } from '../../../shared/components/select/select';
import { SelectOption } from '../../../shared/components/select-option/select-option';
import { NavLink } from '../../../shared/components/nav-link/nav-link';

/** Top bar of the dashboard. */
@Component({
  imports: [NgOptimizedImage, RouterLink, Select, SelectOption, NavLink],
  selector: 'app-dashboard-navbar',
  styleUrl: './dashboard-navbar.css',
  templateUrl: './dashboard-navbar.html',
})
export class DashboardNavbar {}
