import { Component, EventEmitter, Output, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-business-address-map',
  templateUrl: './business-address-map.component.html',
})
export class BusinessAddressMapComponent implements AfterViewInit {
  @Output() addressSelected = new EventEmitter<string>();
  map: any;
  marker: any;

  ngAfterViewInit() {
    this.initMap();
  }

  // Always initialize the map to Pototan, Iloilo
  initMap(): void {
    const pototanLat = 10.9239; // Correct latitude for Pototan
    const pototanLng = 122.6390; // Correct longitude for Pototan

    // Create the map centered at Pototan, Iloilo
    this.map = L.map('map').setView([pototanLat, pototanLng], 13);

    // Load the tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Handle user clicks to place a marker and get address
    this.map.on('click', async (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Remove previous marker if any
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // Place new marker
      this.marker = L.marker([lat, lng]).addTo(this.map);

      // Reverse geocode to get address
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        const address = data.display_name;
        this.addressSelected.emit(address); // Emit the selected address
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    });
  }
}
