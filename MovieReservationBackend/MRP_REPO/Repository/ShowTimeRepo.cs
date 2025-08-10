using Microsoft.EntityFrameworkCore;
using MRP_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MRP_REPO.Repository
{
    public class ShowTimeRepo : IShowTime
    {
        private readonly MovieReservationDbContext _context;

        public ShowTimeRepo(MovieReservationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<ShowTime> ViewShowTimings(int movieId)
        {
            return _context.ShowTimes
                .Include(s => s.Theater)
                .Include(s => s.Screen)
                .Where(s => s.MovieId == movieId)
                .ToList();
        }

        public decimal GetTicketPrice(int showTimeId)
        {
            var show = _context.ShowTimes.FirstOrDefault(s => s.ShowId == showTimeId);
            return show != null ? show.TicketPrice : 0;
        }

        public void AddShow(ShowTime showTime)
        {
            _context.ShowTimes.Add(showTime);
            _context.SaveChanges();
        }

        public void UpdateShow(ShowTime showTime)
        {
            _context.ShowTimes.Update(showTime);
            _context.SaveChanges();
        }

        public void DeleteShow(int showTimeId)
        {
            var show = _context.ShowTimes.FirstOrDefault(s => s.ShowId == showTimeId);
            if (show != null)
            {
                _context.ShowTimes.Remove(show);
                _context.SaveChanges();
            }
        }

        public IEnumerable<ShowTime> ViewAllShows()
        {
            return _context.ShowTimes.ToList();
        }
    }
}