using System;
using System.Collections.Generic;

namespace MRP_DAL.Models;

public partial class Theater
{
    public int TheaterId { get; set; }

    public string Name { get; set; } = null!;

    public string City { get; set; } = null!;

    public virtual ICollection<Screen> Screens { get; set; } = new List<Screen>();
}
