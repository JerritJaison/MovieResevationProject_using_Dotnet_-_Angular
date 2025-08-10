using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MRP_DAL.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int BookingId { get; set; }

    public DateOnly PaymentDate { get; set; }

    public decimal Amount { get; set; }

    public string? PaymentMode { get; set; }

    public string? PaymentStatus { get; set; }
    [JsonIgnore]
    public virtual Booking Booking { get; set; } = null!;
}
