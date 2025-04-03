import {  Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { AppointmentsComponent } from '../pages/appointments/appointments.component';
import { ChildrenComponent } from '../pages/children/children.component';
import { RegisterChildrenComponent } from '../pages/register-children/register-children.component';


export const usersRoutes: Routes = [
  { path: '', component: UsersComponent, children: [
    { path: '', redirectTo: 'appointments', pathMatch: 'full' },
    { path: 'appointments', component: AppointmentsComponent },
    { path: 'children', component: ChildrenComponent }
  ]}
];
