using System.Text.Json.Serialization;

namespace MRP_API.Models
{
    public class BookSeatsRequest
    {
        public int UserId { get; set; }
        public int BookingId { get; set; }
        public int ShowId { get; set; }
        public decimal TotalPrice { get; set; }
        public List<int> SeatIds { get; set; } = new();
        public string RazorpayPaymentId { get; set; }
        public string RazorpayOrderId { get; set; }
        public string RazorpaySignature { get; set; }
    }
}
