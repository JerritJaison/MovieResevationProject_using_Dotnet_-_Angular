using System;
using System.Collections.Generic;

namespace MRP_DAL.Models;

public partial class Seat
{
    public int SeatId { get; set; }

    public int ScreenId { get; set; }

    public string SeatNumber { get; set; } = null!;

    public virtual ICollection<BookedSeat> BookedSeats { get; set; } = new List<BookedSeat>();

    public virtual Screen Screen { get; set; } = null!;
}
