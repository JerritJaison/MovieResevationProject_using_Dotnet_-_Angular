using MRP_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MRP_REPO.Repository
{
    public class ScreenRepo : IScreen
    {
        private readonly MovieReservationDbContext _context;

        public ScreenRepo(MovieReservationDbContext context)
        {
            _context = context;
        }
        public void AddScreen(Screen screen)
        {
            _context.Screens.Add(screen);
            _context.SaveChanges();
            throw new NotImplementedException();
        }

        public void DeleteScreen(int screenId)
        {
            var screen = _context.Screens.Find(screenId);
            if (screen != null)
            {
                _context.Screens.Remove(screen);
                _context.SaveChanges();
            }
            throw new NotImplementedException();
        }

        public IEnumerable<Screen> GetAllScreens()
        {
            return _context.Screens.ToList();
            throw new NotImplementedException();
        }

        public void UpdateScreen(Screen screen)
        {
            var existingScreen = _context.Screens.Find(screen.ScreenId);
            if (existingScreen != null)
            {
                existingScreen.ScreenName = screen.ScreenName;
                existingScreen.Type = screen.Type;
                existingScreen.TheaterId = screen.TheaterId;
                _context.SaveChanges();
            }
            throw new NotImplementedException();
        }
    }
}
