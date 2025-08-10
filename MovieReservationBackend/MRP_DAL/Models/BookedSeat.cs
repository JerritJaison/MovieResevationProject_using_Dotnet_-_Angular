using System;
using System.Collections.Generic;

namespace MRP_DAL.Models;

public partial class BookedSeat
{
    public int BookedSeatId { get; set; }

    public int BookingId { get; set; }

    public int SeatId { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Seat Seat { get; set; } = null!;
}
