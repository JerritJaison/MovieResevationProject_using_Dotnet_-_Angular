using MRP_DAL.Models;
using Microsoft.EntityFrameworkCore;
using MRP_REPO.Repository;

namespace MRP_REPO.Repositories
{
    public class TheaterRepo : ITheater
    {
        private readonly MovieReservationDbContext _context;

        public TheaterRepo(MovieReservationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Theater> ViewTheatersByMovie(int movieId)
        {
            return _context.ShowTimes
                           .Where(st => st.MovieId == movieId)
                           .Include(st => st.Screen)
                           .ThenInclude(s => s.Theater)
                           .Select(st => st.Screen.Theater)
                           .Distinct()
                           .ToList();
        }

        public void AddTheater(Theater theater)
        {
            _context.Theaters.Add(theater);
            _context.SaveChanges();
        }

        public void UpdateTheater(Theater theater)
        {
            _context.Theaters.Update(theater);
            _context.SaveChanges();
        }

        public void DeleteTheater(int theaterId)
        {
            var theater = _context.Theaters.Find(theaterId);
            if (theater != null)
            {
                _context.Theaters.Remove(theater);
                _context.SaveChanges();
            }
        }

        public IEnumerable<Theater> ViewAllTheaters()
        {
            return _context.Theaters.ToList();
        }
    }
}
