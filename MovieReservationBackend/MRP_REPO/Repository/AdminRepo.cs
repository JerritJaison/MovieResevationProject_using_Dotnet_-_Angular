using MRP_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MRP_REPO.Repository
{
    public class AdminRepo : IAdmin
    {
        private readonly MovieReservationDbContext _context;

        public AdminRepo(MovieReservationDbContext context)
        {
            _context= context;
        }
        public void AddAdmin(Admin admin)
        {
            _context.Admins.Add(admin);
            _context.SaveChanges();
        }

        public IEnumerable<Admin> GetAllAdmins()
        {
            return _context.Admins.ToList();
        }

        public void DeleteAdmin(int adminid)
        {
            var admin = _context.Admins.FirstOrDefault(u => u.AdminId == adminid);
            if (admin != null)
            {
                _context.Admins.Remove(admin);
                _context.SaveChanges();
            }
            else
            {
                Console.WriteLine("No User Details Found");
            }
        }

        public void UpdateAdmin(Admin admin)
        {
            _context.Admins.Update(admin);
            _context.SaveChanges();
        }
        public Admin LoginAdmin(string email, string password)
        {
            return _context.Admins.FirstOrDefault(a => a.Email == email && a.Password == password);
        }
        public Admin GetAdminById(int adminid)
        {
            return _context.Admins.FirstOrDefault(a => a.AdminId == adminid);
        }
    }
}
