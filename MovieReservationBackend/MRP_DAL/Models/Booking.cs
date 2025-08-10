using System;
using System.Collections.Generic;

namespace MRP_DAL.Models;
public partial class Booking
{
    public int BookingId { get; set; }

    public int UserId { get; set; }

    public int ShowId { get; set; }

    public DateOnly BookingDate { get; set; }

    public decimal TotalPrice { get; set; }

    public string? PaymentStatus { get; set; }

    public virtual ICollection<BookedSeat> BookedSeats { get; set; } = new List<BookedSeat>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ShowTime Show { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
