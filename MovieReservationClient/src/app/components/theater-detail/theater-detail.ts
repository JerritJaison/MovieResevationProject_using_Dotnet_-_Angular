import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { TheaterService } from '../../services/theater';
import { ShowTimeService } from '../../services/showtime';
import { MovieService } from '../../services/movie';

import { ITheater } from '../../models/ITheater';
import { IMovie } from '../../models/IMovie';
import { IShowTime } from '../../models/IShowTime';

interface TheaterGroup {
  theaterName: string;
  city: string;
  shows: { movieName: string; showDate: string; startTime: string }[];
}

@Component({
  selector: 'app-theater-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theater-detail.html',
  styleUrls: ['./theater-detail.css']
})
export class TheaterDetailComponent implements OnInit {
  theaterGroups: TheaterGroup[] = [];
  filteredTheaterGroups: TheaterGroup[] = [];
  searchTerm = '';

  constructor(
    private theaterService: TheaterService,
    private movieService: MovieService,
    private showTimeService: ShowTimeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTheaterGroups();
  }

  /** Load data and group by theater */
  private loadTheaterGroups(): void {
    forkJoin({
      theaters: this.theaterService.getAllTheaters(),
      showTimes: this.showTimeService.getAllShowTimes(),
      movies: this.movieService.getAllMovies()
    }).subscribe({
      next: ({ theaters, showTimes, movies }) => {
        this.theaterGroups = theaters.map(t => {
          const theaterShows = showTimes
            .filter(st => st.theaterId === t.theaterId)
            .map(st => {
              const movie = movies.find(m => m.movieId === st.movieId);
              return {
                movieName: movie?.title ?? 'Unknown Movie',
                showDate: st.showDate,
                startTime: st.startTime
              };
            });

          return {
            theaterName: t.name,
            city: t.city,
            shows: theaterShows
          };
        }).filter(g => g.shows.length > 0);

        this.filteredTheaterGroups = [...this.theaterGroups];
      },
      error: (err) => console.error('Failed to load data', err)
    });
  }

  /** Search by theater or movie name */
  searchTheaters(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredTheaterGroups = [...this.theaterGroups];
      return;
    }

    this.filteredTheaterGroups = this.theaterGroups.filter(g =>
      g.theaterName.toLowerCase().includes(term) ||
      g.shows.some(s => s.movieName.toLowerCase().includes(term))
    );
  }

  /** Back button */
  backToAdminArea(): void {
    this.router.navigate(['/admin']);
  }
}
