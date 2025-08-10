import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IMovie } from '../../models/IMovie';
import { MovieService } from '../../services/movie';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-detail.html',
  styleUrls: ['./movie-detail.css']
})
export class MovieDetailComponent implements OnInit {
  movies: IMovie[] = [];
  filteredMovies: IMovie[] = [];
  searchTerm = '';

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  /** Fetch all movies */
  loadMovies(): void {
    this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.filteredMovies = data;
      },
      error: (err) => console.error('Failed to load movies', err)
    });
  }

  /** Filter movies */
  searchMovies(): void {
    const t = this.searchTerm.toLowerCase().trim();
    this.filteredMovies = !t
      ? this.movies
      : this.movies.filter(m =>
          m.title.toLowerCase().includes(t) ||
          m.genre.toLowerCase().includes(t) ||
          m.language.toLowerCase().includes(t)
        );
  }

  /** Add new movie (navigate to add page) */
 addMovie(): void {
  this.router.navigate(['/admin/movies/add']);
}


  /** Delete a movie */
  deleteMovie(movieId: number): void {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(movieId).subscribe({
        next: () => {
          alert('Movie deleted successfully!');
          this.movies = this.movies.filter(m => m.movieId !== movieId);
          this.filteredMovies = this.filteredMovies.filter(m => m.movieId !== movieId);
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Failed to delete movie. Check console for details.');
        }
      });
    }
  }

  /** Refresh movie list */
  refreshMovies(): void {
    this.searchTerm = '';
    this.loadMovies();
  }

  trackByMovieId(index: number, movie: IMovie): number {
    return movie.movieId;
  }

  /** Navigate back */
  backToAdminArea(): void {
    this.router.navigate(['/admin']);
  }
  
}
