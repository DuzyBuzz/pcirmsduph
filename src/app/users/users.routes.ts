import {  Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { AppointmentsComponent } from '../pages/appointments/appointments.component';
import { ChildrenComponent } from '../pages/children/children.component';
import { ChildFormComponent } from '../pages/forms/prenatal-form/child-form/child-form.component';
import { PrenatalComponent } from '../pages/prenatal/prenatal.component';
import { PrenatalFormComponent } from '../pages/forms/prenatal-form/prenatal-form.component';


export const usersRoutes: Routes = [
  { path: '', component: UsersComponent, children: [
    { path: '', redirectTo: 'appointments', pathMatch: 'full' },
    { path: 'appointments', component: AppointmentsComponent },
    { path: 'children', component: ChildrenComponent },
    { path: 'prenatal', component: PrenatalComponent },
    { path: 'child-form', component: ChildFormComponent },
    {path: 'prenatal-form', component: PrenatalFormComponent}

  ]}
];
