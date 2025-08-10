using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MRP_DAL.Models;

public partial class ShowTime
{
    public int ShowId { get; set; }

    public int MovieId { get; set; }

    public int ScreenId { get; set; }

    public int TheaterId { get; set; }

    public DateOnly ShowDate { get; set; }   // Changed from DateOnly
    public TimeOnly StartTime { get; set; }  // Changed from TimeOnly

    public decimal TicketPrice { get; set; }

    //[JsonIgnore]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Movie? Movie { get; set; }
    public virtual Screen? Screen { get; set; }
    public virtual Theater? Theater { get; set; }

}