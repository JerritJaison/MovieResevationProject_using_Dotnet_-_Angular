using MRP_DAL.Models;
using System.Collections.Generic;

namespace MRP_REPO.Repository
{
    public interface IMovie
    {
        IEnumerable<Movie> GetAllMovies();
        Movie? GetMovieById(int id);
        IEnumerable<Movie> SearchMovies(string keyword);
        IEnumerable<Movie> FilterMovies(string? genre, string? language);
        int AddMovie(Movie movie);
        void UpdateMovie(Movie movie);
        void DeleteMovie(int id);
    }
}
