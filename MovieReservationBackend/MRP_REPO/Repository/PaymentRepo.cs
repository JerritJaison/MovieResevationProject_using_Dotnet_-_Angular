using Microsoft.EntityFrameworkCore;
using MRP_DAL.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MRP_REPO.Repository
{
    public class PaymentRepo : IPayment
    {
        private readonly MovieReservationDbContext _context;

        public PaymentRepo(MovieReservationDbContext context)
        {
            _context = context;
        }

        // User Function: Make Payment
        public void MakePayment(Payment payment)
        {
            _context.Payments.Add(payment);
            _context.SaveChanges();
        }

        // User Function: View Payment Status
        public async Task<string> GetPaymentStatusAsync(int bookingId)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId);
            return payment?.PaymentStatus ?? "No Payment Found";
        }

        // Admin Function: View All Payments
        public IEnumerable<Payment> GetAllPayments()
        {
            return _context.Payments.Include(p => p.Booking).ToList();
        }

        // Admin Function: Generate Revenue Reports
        public decimal GetTotalRevenue()
        {
            return _context.Payments
                           .Where(p => p.PaymentStatus == "Success")
                           .Sum(p => p.Amount);
        }

        // Admin Function: Search Payment Records
        public IEnumerable<Payment> SearchPayments(string keyword)
        {
            return _context.Payments
                           .Where(p => p.PaymentId.ToString().Contains(keyword) ||
                                       p.PaymentStatus.Contains(keyword))
                           .ToList();
        }
    }
}
