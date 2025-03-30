import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];
