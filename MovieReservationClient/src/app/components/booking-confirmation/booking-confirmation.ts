import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie';
import { IMovie } from '../../models/IMovie';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.html',
  styleUrls: ['./booking-confirmation.css']
})
export class BookingConfirmationComponent implements OnInit {
  showTime:string ='';
  screenName!: string;
  theatreName!: string;
  seatNo: string[] = [];
  movieName: string =''; 
  posterPath: string = '';
  movieId: number = 0;

  constructor(private route: ActivatedRoute, private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.launchConfetti();
    const audio = new Audio('assets/sounds/success.mp3');
    audio.volume = 0.8; // optional
    audio.play().catch(error => {
      console.warn('Autoplay blocked:', error);
    });
    this.route.queryParams.subscribe(params => {
      this.showTime = params['showtime'];
      this.screenName = params['screenName'];
      this.theatreName = params['theatreName'];
      this.seatNo = params['seatNo']?.split(',') || [];
      this.movieId = +params['movieId'];


      if (this.movieId) {
      this.movieService.getMovieById(this.movieId).subscribe({
        next: (movie: IMovie) => {
          this.movieName = movie.title;
          this.posterPath = movie.imageUrl!;
        },
        error: (err) => {
          console.error('Failed to fetch movie data', err);
        }
      });
    }
  });
  }
   goToBookingConfirmation() {
    window.location.href = '/user-area';
  }
  launchConfetti() {
      // Left-side burst
      confetti({
        angle: 60,
        spread: 55,
        particleCount: 50,
        origin: { x: 0 }, // Left
      });
  
      // Right-side burst
      confetti({
        angle: 120,
        spread: 55,
        particleCount: 50,
        origin: { x: 1 }, // Right
      });
  
      // Optional center burst after delay
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 500);
    }
}