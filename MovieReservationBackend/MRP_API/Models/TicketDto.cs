
namespace MRP_API.Models
{
    public class TicketDto
    {
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? MovieName { get; set; }
        public string? Date { get; set; }
        public string? Time { get; set; }
        public string? Seats { get; set; }
        public string? BookingId { get; set; }
        public string? MovieImg { get; set; }
      
        public string? TheaterName {  get; set; }
    }
}
