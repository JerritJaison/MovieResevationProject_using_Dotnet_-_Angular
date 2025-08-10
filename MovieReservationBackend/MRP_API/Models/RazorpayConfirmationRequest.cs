namespace MRP_API.Models
{
    public class RazorpayConfirmationRequest
    {
        public string RazorpayPaymentId { get; set; }
        public string RazorpayOrderId { get; set; }
        public string RazorpaySignature { get; set; }
        public int BookingId { get; set; }
    }
}
