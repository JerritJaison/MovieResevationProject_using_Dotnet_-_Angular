namespace MRP_API.Models
{
    public class UserBookingDto
    {
        public int BookingId { get; set; }
        public string ShowTime { get; set; }
        public string ScreenName { get; set; }
        public string TheaterName { get; set; }
        public List<string> SeatNumbers { get; set; }
        public int MovieId { get; set; }
        public string ImageUrl { get; set; }
        public string MovieName { get; set; }
    }

}
