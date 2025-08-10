namespace MRP_API.Models
{
    public class RazorpayPaymentResponse
    {
        public string id { get; set; }
        public string status { get; set; }
        public int amount { get; set; } // paise
        public string method { get; set; } // e.g. "upi", "netbanking", "card"
    }
}
