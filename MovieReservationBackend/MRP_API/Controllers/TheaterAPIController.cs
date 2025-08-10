using Microsoft.AspNetCore.Mvc;
using MRP_DAL.Models;
using MRP_REPO.Repository;
using MRP_REPO.Repositories;

namespace MRP_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TheaterController : ControllerBase
    {
        private readonly ITheater _theaterRepo;

        public TheaterController(ITheater theaterRepo)
        {
            _theaterRepo = theaterRepo;
        }

        // GET: api/Theater
        [HttpGet]
        public IActionResult GetAllTheaters()
        {
            var theaters = _theaterRepo.ViewAllTheaters();
            return Ok(theaters);
        }

        // GET: api/Theater/movie/5
        [HttpGet("movie/{movieId}")]
        public IActionResult GetTheatersByMovie(int movieId)
        {
            var theaters = _theaterRepo.ViewTheatersByMovie(movieId);
            return Ok(theaters);
        }

        // POST: api/Theater
        [HttpPost]
        public IActionResult AddTheater([FromBody] Theater theater)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _theaterRepo.AddTheater(theater);
            return Ok(new { message = "Theater added successfully" });
        }

        // PUT: api/Theater
        [HttpPut]
        public IActionResult UpdateTheater([FromBody] Theater theater)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _theaterRepo.UpdateTheater(theater);
            return Ok(new { message = "Theater updated successfully" });
        }

        // DELETE: api/Theater/5
        [HttpDelete("{theaterId}")]
        public IActionResult DeleteTheater(int theaterId)
        {
            _theaterRepo.DeleteTheater(theaterId);
            return Ok(new { message = "Theater deleted successfully" });
        }
    }

}