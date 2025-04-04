import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ChildrenComponent } from './children/children.component';
import { PrenatalComponent } from './prenatal/prenatal.component';
import { ChildFormComponent } from './forms/prenatal-form/child-form/child-form.component';
import { MothersPregnancyRecordComponent } from "./prenatal/mothers-pregnancy-record/mothers-pregnancy-record.component";


@NgModule({
  declarations: [

    DashboardComponent,
    AppointmentsComponent,
    ChildrenComponent,
    ChildFormComponent,
    PrenatalComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // ✅ Added FormsModule for ngModel support
    ReactiveFormsModule,
    RouterModule,
    FullCalendarModule,
    NgxChartsModule,
    MothersPregnancyRecordComponent
],
  exports: [
    DashboardComponent,
    AppointmentsComponent,
    NgxChartsModule,
    ChildrenComponent,
    ChildFormComponent,
    PrenatalComponent
  ],
})
export class PagesModule {}
