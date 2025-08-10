using MRP_DAL.Models;
using MRP_REPO.Repository;
using System.Collections.Generic;
using System.Linq;

namespace MRP_REPO.Services
{
    public class MovieRepo : IMovie
    {
        private readonly MovieReservationDbContext _context;

        public MovieRepo(MovieReservationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Movie> GetAllMovies()
        {
            return _context.Movies.ToList();
        }

        public Movie? GetMovieById(int id)
        {
            return _context.Movies.FirstOrDefault(m => m.MovieId == id);
        }

        public IEnumerable<Movie> SearchMovies(string keyword)
        {
            return _context.Movies
                .Where(m => m.Title.Contains(keyword) || m.Genre.Contains(keyword))
                .ToList();
        }

        public IEnumerable<Movie> FilterMovies(string? genre, string? language)
        {
            var query = _context.Movies.AsQueryable();

            if (!string.IsNullOrEmpty(genre))
                query = query.Where(m => m.Genre == genre);

            if (!string.IsNullOrEmpty(language))
                query = query.Where(m => m.Language == language);

            return query.ToList();
        }

        public int AddMovie(Movie movie)
        {
            _context.Movies.Add(movie);
            _context.SaveChanges();
            return movie.MovieId;
        }

        public void UpdateMovie(Movie movie)
        {
            var existing = _context.Movies.FirstOrDefault(m => m.MovieId == movie.MovieId);
            if (existing != null)
            {
                existing.Title = movie.Title;
                existing.Genre = movie.Genre;
                existing.Language = movie.Language;
                existing.Duration = movie.Duration;
                existing.ImageUrl = movie.ImageUrl;
                _context.SaveChanges();
            }
        }

        public void DeleteMovie(int id)
        {
            var movie = _context.Movies.FirstOrDefault(m => m.MovieId == id);
            if (movie != null)
            {
                // Remove all showtimes linked to this movie
                var relatedShowTimes = _context.ShowTimes.Where(st => st.MovieId == id).ToList();
                if (relatedShowTimes.Count > 0)
                {
                    _context.ShowTimes.RemoveRange(relatedShowTimes);
                }

                // Now remove the movie
                _context.Movies.Remove(movie);
                _context.SaveChanges();
            }
        }

    }
}
