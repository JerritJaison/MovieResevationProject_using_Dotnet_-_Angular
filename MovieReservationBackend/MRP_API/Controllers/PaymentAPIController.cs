using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // :white_check_mark: for Include / ThenInclude
using Microsoft.Extensions.Configuration;
using MRP_API.Models;
using MRP_DAL.Models;
using MRP_REPO.Repository;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Cryptography;
using System.Text;


namespace MRP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPayment _paymentService;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly EmailService _emailService;
        private readonly MovieReservationDbContext _context; // :white_check_mark: add DbContext
        public PaymentController(IPayment paymentService,
                                 IConfiguration configuration,
                                 EmailService emailService,
                                 MovieReservationDbContext context)
        {
            _paymentService = paymentService;
            _configuration = configuration;
            _httpClient = new HttpClient();
            _emailService = emailService;
            _context = context; // :white_check_mark: assign context
        }

        private string HmacSHA256(string data, string secret)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret)))
            {
                var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }


        // Create Order (Fake Order Creation for UI)
        [HttpPost("create-order")]
        public IActionResult CreateOrder([FromBody] decimal amount)
        {
            var fakeOrderId = $"order_test_{System.Guid.NewGuid().ToString().Substring(0, 8)}";
            return Ok(new { orderId = fakeOrderId });
        }
        // Confirm Payment (Fake Verification)
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPayment([FromBody] RazorpayConfirmationRequest request)
        {
            // Step 1: Verify signature
            string keySecret = _configuration["Razorpay:KeySecret"];
            string generatedSignature = HmacSHA256(
                request.RazorpayOrderId + "|" + request.RazorpayPaymentId,
                keySecret
            );

            if (generatedSignature != request.RazorpaySignature)
                return BadRequest("Invalid payment signature");

            // Step 2: Get payment details from Razorpay
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue(
                    "Basic",
                    Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes(
                        $"{_configuration["Razorpay:KeyId"]}:{keySecret}"
                    ))
                );

            var response = await _httpClient.GetAsync($"https://api.razorpay.com/v1/payments/{request.RazorpayPaymentId}");
            if (!response.IsSuccessStatusCode)
                return BadRequest("Failed to fetch Razorpay payment details");

            var paymentJson = await response.Content.ReadAsStringAsync();
            var razorpayPayment = System.Text.Json.JsonSerializer.Deserialize<RazorpayPaymentResponse>(paymentJson);

            // Step 3: Save Payment
            var payment = new Payment
            {
                BookingId = request.BookingId,
                Amount = razorpayPayment.amount / 100m, // Razorpay gives amount in paise
                PaymentDate = DateOnly.FromDateTime(DateTime.Now),
                PaymentStatus = razorpayPayment.status == "captured" ? "Success" : "Failed",
                PaymentMode = razorpayPayment.method?.ToUpperInvariant() ?? "UNKNOWN"                
            };

            _paymentService.MakePayment(payment);

            // Step 4: Send ticket email if payment succeeded
            TicketDto ticket = null;
            if (payment.PaymentStatus == "Success")
            {
                var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Show)
                    .ThenInclude(s => s.Movie)
                .Include(b => b.Show)
                    .ThenInclude(s => s.Theater) // 👈 Add this line to include Theater
                .Include(b => b.BookedSeats)
                    .ThenInclude(bs => bs.Seat)
                .FirstOrDefaultAsync(b => b.BookingId == request.BookingId);


                if (booking != null)
                {
                    ticket = new TicketDto
                    {
                        Email = booking.User?.Email ?? "N/A",
                        UserName = booking.User?.Name ?? "Guest",
                        MovieName = booking.Show?.Movie?.Title ?? "Unknown",
                        Date = booking.Show?.ShowDate.ToString("yyyy-MM-dd") ?? "N/A",
                        Time = booking.Show?.StartTime.ToString(@"hh\:mm") ?? "N/A",
                        Seats = string.Join(", ", booking.BookedSeats.Select(bs => bs.Seat.SeatNumber)),
                        BookingId = booking.BookingId.ToString(),
                        MovieImg = booking.Show?.Movie?.ImageUrl ?? "",
                        TheaterName = booking.Show?.Theater?.Name ?? "Unknown"
                    };

                    await _emailService.SendTicketEmailAsync(ticket);
                }
            }

            if (ticket == null)
                return NotFound("Booking not found or payment failed");

            return Ok(ticket);
        }


        // Payment status
        [HttpGet("status/{bookingId}")]
        public async Task<IActionResult> GetPaymentStatus(int bookingId)
        {
            var status = await _paymentService.GetPaymentStatusAsync(bookingId);
            return Ok(new { bookingId = bookingId, status = status });
        }
        // Admin: View All Payments
        [HttpGet("all")]
        public ActionResult<IEnumerable<Payment>> GetAllPayments()
        {
            return Ok(_paymentService.GetAllPayments());
        }
        // Revenue Report
        [HttpGet("revenue")]
        public ActionResult<decimal> GetTotalRevenue()
        {
            return Ok(_paymentService.GetTotalRevenue());
        }
        // Search Payments
        [HttpGet("search")]
        public ActionResult<IEnumerable<Payment>> SearchPayments([FromQuery] string keyword)
        {
            return Ok(_paymentService.SearchPayments(keyword));
        }
    }
}