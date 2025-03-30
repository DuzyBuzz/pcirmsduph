import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { TaxFilingComponent } from '../pages/tax-filing/tax-filing.component';


export const usersRoutes: Routes = [
  { path: '', component: UsersComponent, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'tax-filing', component: TaxFilingComponent}
  ]}
];
