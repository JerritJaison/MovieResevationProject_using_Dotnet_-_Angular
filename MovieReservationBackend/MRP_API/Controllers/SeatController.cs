using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MRP_API.Models;
using MRP_DAL.Models;

namespace MRP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatController : ControllerBase
    {
        private readonly MovieReservationDbContext _context;

        public SeatController(MovieReservationDbContext context)
        {
            _context = context;
        }

        // GET: api/seats/show/{screenId}
        [HttpGet("show/{screenId}")]
        public async Task<ActionResult<IEnumerable<SeatDTO>>> GetSeatsByScreen(int screenId)
        {
            var allSeats = await _context.Seats
                .Where(s => s.ScreenId == screenId)
                .Include(s => s.BookedSeats)
                .ToListAsync();

            var seatDtos = allSeats.Select(seat => new SeatDTO
            {
                SeatId = seat.SeatId,
                SeatNumber = seat.SeatNumber,
                IsBooked = seat.BookedSeats.Any(),  // if any booking exists
                Price = 150  // assign fixed or dynamic pricing here
            }).ToList();

            return Ok(seatDtos);
        }

        // GET: api/seats/show/{showId}/screen/{screenId}
        [HttpGet("show/{showId}/screen/{screenId}")]
        public async Task<ActionResult<IEnumerable<SeatDTO>>> GetSeatsByShowAndScreen(int showId, int screenId)
        {
            var show = await _context.ShowTimes
        .FirstOrDefaultAsync(s => s.ShowId == showId && s.ScreenId == screenId);

            if (show == null)
            {
                return NotFound("Show not found.");
            }

            var allSeats = await _context.Seats
                .Where(s => s.ScreenId == screenId)
                .Include(s => s.BookedSeats)
                    .ThenInclude(bs => bs.Booking)
                .ToListAsync();

            var seatDtos = allSeats.Select(seat => new SeatDTO
            {
                SeatId = seat.SeatId,
                SeatNumber = seat.SeatNumber,
                IsBooked = seat.BookedSeats.Any(bs => bs.Booking.ShowId == showId), // Now checking via Booking
                Price = show.TicketPrice
            }).ToList();

            return Ok(seatDtos);
        }

        [HttpGet("ShowDetails/{showId}")]
        public async Task<IActionResult> GetShowDetails(int showId)
        {
            var showDetails = await _context.ShowTimes
                .Where(st => st.ShowId == showId)
                .Select(st => new ShowDetailsDto
                {
                    ShowId = st.ShowId,
                    TheaterName = st.Theater.Name,
                    ScreenType = st.Screen.Type,
                    ShowDate = st.ShowDate,
                    ShowTime = st.StartTime,
                    Price = st.TicketPrice
                })
                .FirstOrDefaultAsync();

            if (showDetails == null)
                return NotFound($"No show found with ID {showId}");

            return Ok(showDetails);
        }

    }

}
