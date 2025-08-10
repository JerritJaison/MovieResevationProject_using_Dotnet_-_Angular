using MRP_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MRP_REPO.Repository
{
    public interface IShowTime
    {
        // User Functions
        IEnumerable<ShowTime> ViewShowTimings(int movieId);
        decimal GetTicketPrice(int showTimeId);

        // Admin Functions
        void AddShow(ShowTime showTime);
        void UpdateShow(ShowTime showTime);
        void DeleteShow(int showTimeId);
        IEnumerable<ShowTime> ViewAllShows();
    }

}
