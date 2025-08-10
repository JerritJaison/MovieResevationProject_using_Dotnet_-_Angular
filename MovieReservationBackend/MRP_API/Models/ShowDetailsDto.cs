namespace MRP_API.Models
{
    public class ShowDetailsDto
    {
        public int ShowId { get; set; }
        public string TheaterName { get; set; }
        public string ScreenType { get; set; }
        public DateOnly ShowDate { get; set; }
        public TimeOnly ShowTime { get; set; }
        public decimal Price { get; set; }
    }
}
