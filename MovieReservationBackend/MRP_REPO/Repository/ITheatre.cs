using MRP_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MRP_REPO.Repository
{
    public interface ITheater
    {

        IEnumerable<Theater> ViewTheatersByMovie(int movieId);

        void AddTheater(Theater theater);
        void UpdateTheater(Theater theater);
        void DeleteTheater(int theaterId);
        IEnumerable<Theater> ViewAllTheaters();

    }
}