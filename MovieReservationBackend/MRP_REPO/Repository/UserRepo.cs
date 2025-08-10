using MRP_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MRP_REPO.Repository
{
    public class UserRepo : IUser
    {
        private readonly MovieReservationDbContext _context;

        public UserRepo(MovieReservationDbContext context)
        {
            _context=context;
        }
        public void DeleteUser(int userid)
        {
            var user= _context.Users.FirstOrDefault(u=>u.UserId==userid);
            if (user!=null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            else
            {
                Console.WriteLine("No User Details Found");
            }
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User LoginUser(string email, string password)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email && u.Password == password);
        }
            

        public void RegisterUser(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public User SearchUser(int? userId, string email)
        {
            return _context.Users.FirstOrDefault(u =>
                (userId.HasValue && u.UserId == userId) ||
                (!string.IsNullOrEmpty(email) && u.Email == email));
        }

        public void UpdateUser(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }
    }
}
