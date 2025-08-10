import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie';
import { IMovie } from '../../models/IMovie';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-area.html',
  styleUrls: ['./user-area.css']
})
export class UserArea implements OnInit {
  movies: IMovie[] = [];
  filteredMovies: IMovie[] = [];

  searchTerm: string = '';
  selectedGenre: string = '';
  selectedLanguage: string = '';

  sliderImages: string[] = [
  'assets/images/avatarslide.jpeg',
  'assets/images/spiderman.png',
  'assets/images/conjuring.jpg',
  'assets/images/tron_ares.jpg',
  'assets/images/war2.jpg',
  'assets/images/avengers.jpg'
  
  
];
currentSlide = 0;

  genres: string[] = [];
  languages: string[] = [];

  constructor(
    private movieService: MovieService,
    private router: Router,
    private auth: AuthService
  ) {}
  isHistoryModalOpen: boolean = false;
historyBookingId: string = '';

viewHistory() {
  this.isHistoryModalOpen = true;
}

closeHistoryModal() {
  this.isHistoryModalOpen = false;
  this.historyBookingId = '';
}



submitBookingId() {
  this.router.navigate(['/ticketview'], { queryParams: { bookingId: this.historyBookingId } });
}


  ngOnInit(): void {

    this.preloadImages(this.sliderImages);
    this.loadMovies();

    setInterval(() => {
    this.currentSlide = (this.currentSlide + 1) % this.sliderImages.length;
  }, 3000); // every 3 sec

  }

  preloadImages(images: string[]) {
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

  loadMovies(): void {
    this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.filteredMovies = data;

        // Extract unique genres and languages
        this.genres = [...new Set(data.map(movie => movie.genre))];
        this.languages = [...new Set(data.map(movie => movie.language))];
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      }
    });
  }

  filterMovies(): void {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesGenre = this.selectedGenre ? movie.genre === this.selectedGenre : true;
      const matchesLanguage = this.selectedLanguage ? movie.language === this.selectedLanguage : true;
      return matchesSearch && matchesGenre && matchesLanguage;
    });
  }

  // Navbar buttons
  viewProfile() {
    this.router.navigate(['/profile']);
  }



  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.auth.logout(); // Use AuthService to handle token removal + redirect
    }
  }

  // Book movie button
  bookMovie(movieId: number) {
    this.router.navigate(['/booking', movieId]);
  }
}
