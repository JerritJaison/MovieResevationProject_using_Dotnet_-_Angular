import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingComponent } from './components/booking/booking';
import { SeatSelectionComponent } from './components/seat-selection/seat-selection';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule,BookingComponent,SeatSelectionComponent,RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}