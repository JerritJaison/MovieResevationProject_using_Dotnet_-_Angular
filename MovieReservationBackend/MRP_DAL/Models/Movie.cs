using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MRP_DAL.Models;

public partial class Movie
{
    public int MovieId { get; set; }

    public string Title { get; set; } = null!;

    public string Genre { get; set; } = null!;

    public string Language { get; set; } = null!;

    public string Duration { get; set; } = null!;

    public string? ImageUrl {  get; set; }
    public virtual ICollection<ShowTime> ShowTimes { get; set; } = new List<ShowTime>();
}
