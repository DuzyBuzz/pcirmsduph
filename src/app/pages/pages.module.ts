import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { TaxFilingComponent } from './tax-filing/tax-filing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { RegisterChildrenComponent } from './register-children/register-children.component';
import { ChildrenComponent } from './children/children.component';


@NgModule({
  declarations: [
    TaxFilingComponent, 
    DashboardComponent, 
    AppointmentsComponent, 
    RegisterChildrenComponent,
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
    TaxFilingComponent,
    DashboardComponent,
    AppointmentsComponent,
    RegisterChildrenComponent,
    NgxChartsModule,
    ChildrenComponent
  ],
})
export class PagesModule {}
