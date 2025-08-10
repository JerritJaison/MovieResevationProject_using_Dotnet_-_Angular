using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MRP_API.Models;
using MRP_DAL.Models;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly MovieReservationDbContext _context;

    public BookingController(MovieReservationDbContext context)
    {
        _context = context;
    }
    // Controller
    [HttpGet("all-booking-ids")]
    public ActionResult<IEnumerable<int>> GetAllBookingIds()
    {
        var bookingIds = _context.Bookings.Select(b => b.BookingId).ToList();
        return Ok(bookingIds);
    }

    // DELETE: api/Booking/Admin/Cancel/{bookingId}
    [HttpDelete("Admin/Cancel/{bookingId}")]
    public void AdminCancelBooking(int bookingId)
    {
        var booking = _context.Bookings.FirstOrDefault(b => b.BookingId == bookingId);
        if (booking != null)
        {
            _context.Bookings.Remove(booking);
            _context.SaveChanges();
        }

    }



    [HttpGet("ticket/{bookingId}")]
    public async Task<ActionResult<UserBookingDto>> GetTicketByBookingId(int bookingId)
    {
        var ticket = await (from b in _context.Bookings
                            join s in _context.ShowTimes on b.ShowId equals s.ShowId
                            join scr in _context.Screens on s.ScreenId equals scr.ScreenId
                            join t in _context.Theaters on s.TheaterId equals t.TheaterId
                            join m in _context.Movies on s.MovieId equals m.MovieId
                            join bs in _context.BookedSeats on b.BookingId equals bs.BookingId
                            where b.BookingId == bookingId
                            select new UserBookingDto
                            {
                                BookingId = b.BookingId,
                                ShowTime = s.StartTime.ToString("h:mm tt"),
                                ScreenName = scr.ScreenName,
                                TheaterName = t.Name,
                                MovieId = m.MovieId,
                                ImageUrl = m.ImageUrl,
                                MovieName = m.Title,
                                SeatNumbers = _context.BookedSeats
                                        .Where(bs => bs.BookingId == b.BookingId)
                                        .Select(bs => bs.Seat.SeatNumber)
                                        .ToList()
                            }).FirstOrDefaultAsync();

        if (ticket == null)
            return NotFound("Ticket not found");

        return Ok(ticket);
    }
}