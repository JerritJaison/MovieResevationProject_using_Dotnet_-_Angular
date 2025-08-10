using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MRP_API.Models;
using MRP_DAL.Models;
using Razorpay.Api;

namespace MRP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookedSeatController : ControllerBase
    {
        private readonly MovieReservationDbContext _context;

        public BookedSeatController(MovieReservationDbContext context)
        {
            _context = context;
        }

        [HttpPost("book")]
        public async Task<IActionResult> BookSeats([FromBody] BookSeatsRequest request)
        {
            // Debug log
            Console.WriteLine("BookSeats called.");
            Console.WriteLine($"UserId: {request.UserId}");
            Console.WriteLine($"ShowId: {request.ShowId}");
            Console.WriteLine($"TotalPrice: {request.TotalPrice}");
            Console.WriteLine($"SeatIds: {string.Join(",", request.SeatIds)}");
            Console.WriteLine($"RazorpayPaymentId: {request.RazorpayPaymentId}");
            Console.WriteLine($"RazorpayOrderId: {request.RazorpayOrderId}");
            Console.WriteLine($"RazorpaySignature: {request.RazorpaySignature}");

            // Step 1: Verify Signature
            var generatedSignature = HmacSHA256(
                request.RazorpayOrderId + "|" + request.RazorpayPaymentId,
                "HdNJwdhjxxCdeBceVvQwfyXw"
            );

            Console.WriteLine($"GeneratedSignature: {generatedSignature}");

            if (generatedSignature != request.RazorpaySignature)
            {
                Console.WriteLine("Signature verification failed.");
                return BadRequest("Payment verification failed.");
            }

            // Step 2: Save Booking and Seats
            var newBooking = new Booking
            {
                UserId = request.UserId,
                ShowId = request.ShowId,
                BookingDate = DateOnly.FromDateTime(DateTime.Now),
                TotalPrice = request.TotalPrice,
                PaymentStatus = "Paid"
            };

            _context.Bookings.Add(newBooking);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Booking saved with BookingId: {newBooking.BookingId}");

            var bookedSeats = request.SeatIds.Select(seatId => new BookedSeat
            {
                SeatId = seatId,
                BookingId = newBooking.BookingId
            }).ToList();

            _context.BookedSeats.AddRange(bookedSeats);
            await _context.SaveChangesAsync();

            Console.WriteLine("BookedSeats saved to database.");

            return Ok(new { message = "Booking confirmed", bookingId = newBooking.BookingId });
        }

        // Razorpay Signature Verification Helper
        private static string HmacSHA256(string data, string key)
        {
            var encoding = new System.Text.ASCIIEncoding();
            byte[] keyByte = encoding.GetBytes(key);
            byte[] messageBytes = encoding.GetBytes(data);
            using (var hmacsha256 = new System.Security.Cryptography.HMACSHA256(keyByte))
            {
                byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                return BitConverter.ToString(hashmessage).Replace("-", "").ToLower();
            }
        }

        [HttpPost("create-order")]
        public IActionResult CreateRazorpayOrder([FromBody] RazorpayOrderRequest request)
        {
            Console.WriteLine("CreateRazorpayOrder called.");
            Console.WriteLine($"Requested amount: {request.TotalAmount}");

            RazorpayClient client = new RazorpayClient("rzp_test_2VUTqUajDEKWnU", "HdNJwdhjxxCdeBceVvQwfyXw");

            Dictionary<string, object> options = new Dictionary<string, object>
            {
                { "amount", request.TotalAmount * 100 }, // in paise
                { "currency", "INR" },
                { "receipt", Guid.NewGuid().ToString() },
                { "payment_capture", 1 }
            };

            Razorpay.Api.Order order = client.Order.Create(options);

            Console.WriteLine($"Order created with OrderId: {order["id"]}");

            return Ok(new
            {
                orderId = order["id"].ToString(),
                amount = order["amount"],
                currency = order["currency"]
            });
        }
    }
}
