import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ChildrenComponent } from './children/children.component';


@NgModule({
  declarations: [

    DashboardComponent,
    AppointmentsComponent,
    ChildrenComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // ✅ Added FormsModule for ngModel support
    ReactiveFormsModule,
    RouterModule,
    FullCalendarModule,
    NgxChartsModule,
  ],
  exports: [
    DashboardComponent,
    AppointmentsComponent,
    NgxChartsModule,
    ChildrenComponent
  ],
})
export class PagesModule {}
