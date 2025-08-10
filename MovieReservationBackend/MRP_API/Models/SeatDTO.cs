namespace MRP_API.Models
{
    public class SeatDTO
    {
        public int SeatId { get; set; }
        public string SeatNumber { get; set; }
        public bool IsBooked { get; set; }
        public decimal Price { get; set; }
    }
}
