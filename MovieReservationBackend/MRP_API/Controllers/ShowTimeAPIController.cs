using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRP_DAL.Models;
using MRP_REPO.Repository;

namespace MRP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowTimeAPIController : ControllerBase
    {
        private readonly IShowTime _showTimeRepo;

        public ShowTimeAPIController(IShowTime showTimeRepo)
        {
            _showTimeRepo = showTimeRepo;
        }

        // GET: api/ShowTimeAPI/ViewAllShows
        [HttpGet("ViewAllShows")]
        public IActionResult ViewAllShows()
        {
            var shows = _showTimeRepo.ViewAllShows();
            return Ok(shows);
        }

        // GET: api/ShowTimeAPI/ViewShowTimings/{movieId}/{theaterId}
        [HttpGet("ViewShowTimings/{movieId}")]
        public IActionResult ViewShowTimings(int movieId)
        {
            var showTimes = _showTimeRepo.ViewShowTimings(movieId);
            return Ok(showTimes);
        }

        // GET: api/ShowTimeAPI/GetTicketPrice/{showTimeId}
        [HttpGet("GetTicketPrice/{showTimeId}")]
        public IActionResult GetTicketPrice(int showTimeId)
        {
            var price = _showTimeRepo.GetTicketPrice(showTimeId);
            return Ok(price);
        }

        // POST: api/ShowTimeAPI/AddShow
        [HttpPost("AddShow")]
        public IActionResult AddShow([FromBody] ShowTime showTime)
        {
            if (showTime == null)
                return BadRequest("Invalid showtime data.");

            _showTimeRepo.AddShow(showTime);
            return Ok("Showtime added successfully.");
        }

        // PUT: api/ShowTimeAPI/UpdateShow
        [HttpPut("UpdateShow")]
        public IActionResult UpdateShow([FromBody] ShowTime showTime)
        {
            if (showTime == null)
                return BadRequest("Invalid showtime data.");

            _showTimeRepo.UpdateShow(showTime);
            return Ok("Showtime updated successfully.");
        }

        // DELETE: api/ShowTimeAPI/DeleteShow/{showId}
        [HttpDelete("DeleteShow/{showId}")]
        public IActionResult DeleteShow(int showId)
        {
            _showTimeRepo.DeleteShow(showId);
            return Ok("Showtime deleted successfully.");
        }
    }
}