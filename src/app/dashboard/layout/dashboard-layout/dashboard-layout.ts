import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardNavbar } from '../dashboard-navbar/dashboard-navbar';

@Component({
  imports: [RouterOutlet, DashboardNavbar],
  selector: 'app-dashboard-layout',
  styleUrl: './dashboard-layout.css',
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {}
