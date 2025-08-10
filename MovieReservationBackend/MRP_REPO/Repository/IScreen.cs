using MRP_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MRP_REPO.Repository
{
    public interface IScreen
    {
        IEnumerable<Screen> GetAllScreens();
        void AddScreen(Screen screen);
        void UpdateScreen(Screen screen);
        void DeleteScreen(int screenId);
    }
}
