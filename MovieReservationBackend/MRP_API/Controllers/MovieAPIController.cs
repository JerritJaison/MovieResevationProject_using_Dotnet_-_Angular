using Microsoft.AspNetCore.Mvc;
using MRP_DAL.Models;
using MRP_REPO.Repository;

namespace MRP_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieAPIController : ControllerBase
    {
        private readonly IMovie _movieRepo;

        public MovieAPIController(IMovie movieRepo)
        {
            _movieRepo = movieRepo;
        }

        [HttpGet]
        public IActionResult GetAllMovies()
        {
            var movies = _movieRepo.GetAllMovies();
            return Ok(movies);
        }

        [HttpGet("{id}")]
        public IActionResult GetMovieById(int id)
        {
            var movie = _movieRepo.GetMovieById(id);
            if (movie == null)
                return NotFound(new { message = $"Movie with ID {id} not found" });

            return Ok(movie);
        }

        [HttpGet("search")]
        public IActionResult SearchMovies([FromQuery] string keyword)
        {
            var movies = _movieRepo.SearchMovies(keyword);
            return Ok(movies);
        }

        [HttpGet("filter")]
        public IActionResult FilterMovies([FromQuery] string? genre, [FromQuery] string? language)
        {
            var movies = _movieRepo.FilterMovies(genre, language);
            return Ok(movies);
        }

        [HttpPost]
        public IActionResult AddMovie([FromBody] Movie movie)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int movieId = _movieRepo.AddMovie(movie);
            return Ok(movieId);
        }

        [HttpPut]
        public IActionResult UpdateMovie([FromBody] Movie movie)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = _movieRepo.GetMovieById(movie.MovieId);
            if (existing == null)
                return NotFound(new { message = $"Movie with ID {movie.MovieId} not found" });

            _movieRepo.UpdateMovie(movie);
            return Ok(new { message = "Movie updated successfully" });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMovie(int id)
        {
            var existing = _movieRepo.GetMovieById(id);
            if (existing == null)
                return NotFound(new { message = $"Movie with ID {id} not found" });

            _movieRepo.DeleteMovie(id);
            return Ok(new { message = "Movie deleted successfully" });
        }
    }
}
