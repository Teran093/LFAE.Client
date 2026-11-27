import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardNavbar } from '../dashboard-navbar/dashboard-navbar';

/** Shell of the dashboard: navbar on top and the current page below. */
@Component({
  imports: [RouterOutlet, DashboardNavbar],
  selector: 'app-dashboard-layout',
  styleUrl: './dashboard-layout.css',
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {}
