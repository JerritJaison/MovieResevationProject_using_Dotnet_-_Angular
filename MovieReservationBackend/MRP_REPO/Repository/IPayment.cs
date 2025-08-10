using MRP_DAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MRP_REPO.Repository
{
    public interface IPayment
    {
        // User Functions
        void MakePayment(Payment payment);
        Task<string> GetPaymentStatusAsync(int bookingId);

        // Admin Functions
        IEnumerable<Payment> GetAllPayments();
        decimal GetTotalRevenue();
        IEnumerable<Payment> SearchPayments(string keyword);
    }
}
