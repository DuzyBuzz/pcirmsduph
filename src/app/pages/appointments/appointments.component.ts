import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-appointments',
  standalone: false,
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'], // ✅ Fixed: changed styleUrl to styleUrls
})
export class AppointmentsComponent implements OnInit {
  calendarOptions!: CalendarOptions;

  ngOnInit() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
      },
      editable: true,
      selectable: true,
      events: [
        { title: 'Prenatal Checkup', date: '2025-04-05', color: '#34D399' },
        { title: '1st Hepatitis B Vaccine', date: '2025-04-10', color: '#F87171' },
        { title: 'BCG Vaccine', date: '2025-04-15', color: '#60A5FA' },
        { title: 'Polio Vaccine', date: '2025-04-20', color: '#FBBF24' },
        { title: 'MMR Vaccine', date: '2025-05-01', color: '#A78BFA' },
      ],
      eventClick: this.onEventClick.bind(this),
    };
  }

  onEventClick(eventInfo: any) {
    alert(`Appointment: ${eventInfo.event.title}\nDate: ${eventInfo.event.start.toISOString().split('T')[0]}`);
  }
}
