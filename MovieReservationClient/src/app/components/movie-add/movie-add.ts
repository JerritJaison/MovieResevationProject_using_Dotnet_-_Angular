import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MovieService } from '../../services/movie';
import { ShowTimeService } from '../../services/showtime';
import { TheaterService } from '../../services/theater';
import { ScreenService } from '../../services/screen';

import { ITheater } from '../../models/ITheater';
import { IScreen } from '../../models/IScreen';
import { IMovie } from '../../models/IMovie';
import { IShowTime } from '../../models/IShowTime';

@Component({
  selector: 'app-movie-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-add.html',
  styleUrls: ['./movie-add.css']
})
export class MovieAddComponent implements OnInit {
  movie: IMovie = {
    movieId: 0,
    title: '',
    genre: '',
    language: '',
    duration: '',
    imageUrl: ''
  };

  theaters: ITheater[] = [];
  screens: IScreen[] = [];
  filteredScreens: IScreen[] = [];

  selectedTheaterId: number | null = null;
  selectedScreenId: number | null = null;

  showTime: IShowTime = {
    screenId: 0,
    theaterId: 0,
    showDate: '',
    startTime: '',
    ticketPrice: 0
  };

  constructor(
    private movieService: MovieService,
    private showTimeService: ShowTimeService,
    private theaterService: TheaterService,
    private screenService: ScreenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTheatersAndScreens();
  }

  loadTheatersAndScreens(): void {
    this.theaterService.getAllTheaters().subscribe({
      next: (data) => (this.theaters = data),
      error: (err) => console.error('Failed to load theaters', err)
    });

    this.screenService.getAllScreens().subscribe({
      next: (data) => (this.screens = data),
      error: (err) => console.error('Failed to load screens', err)
    });
  }

  onTheaterChange(): void {
    this.filteredScreens = this.screens.filter((s) => s.theaterId === this.selectedTheaterId);
    this.selectedScreenId = null;
  }

  addMovie(): void {
    if (!this.selectedTheaterId || !this.selectedScreenId) {
      alert('Please select both theater and screen.');
      return;
    }

    this.movieService.addMovie(this.movie).subscribe({
      next: (movieId: number) => {
        const showTimePayload: IShowTime & { movieId: number } = {
          movieId: movieId,
          theaterId: this.selectedTheaterId!,
          screenId: this.selectedScreenId!,
          showDate: this.showTime.showDate,
          startTime: this.formatTime(this.showTime.startTime),
          ticketPrice: this.showTime.ticketPrice
        };

        console.log('ShowTime Payload:', showTimePayload);

        this.showTimeService.addShowTime(showTimePayload).subscribe({
          next: () => {
            alert('Movie and showtime added successfully!');
            this.router.navigate(['/admin/movies']);
          },
          error: (err) => {
            console.error('Error adding showtime:', err);
            alert('Movie added but failed to add showtime.\nCheck console for details.');
          }
        });
      },
      error: (err) => {
        console.error('Error adding movie:', err);
        alert('Failed to add movie. Check console for details.');
      }
    });
  }

  private formatTime(time: string): string {
    return time.length === 5 ? `${time}:00` : time;
  }

  backToMovieList(): void {
    this.router.navigate(['/admin/movies']);
  }
}
