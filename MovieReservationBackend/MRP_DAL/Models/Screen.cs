using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MRP_DAL.Models;

public partial class Screen
{
    public int ScreenId { get; set; }

    public int TheaterId { get; set; }

    public string ScreenName { get; set; } = null!;

    public int TotalSeats { get; set; }

    public string? Type { get; set; }

    [JsonIgnore]
    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
    [JsonIgnore]
    public virtual ICollection<ShowTime> ShowTimes { get; set; } = new List<ShowTime>();
    [JsonIgnore]
    public virtual Theater Theater { get; set; } = null!;
}
