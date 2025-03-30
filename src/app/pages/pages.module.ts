import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaxFilingComponent } from './tax-filing/tax-filing.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [TaxFilingComponent, DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FullCalendarModule,
    NgxChartsModule, // ✅ Import ngx-charts
  ],
  exports: [TaxFilingComponent, DashboardComponent],
})
export class PagesModule {}
