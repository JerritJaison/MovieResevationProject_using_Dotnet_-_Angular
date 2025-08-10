using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MRP_DAL.Models;
namespace MRP_REPO.Repository
{
    public interface IUser
    {
        void RegisterUser(User user);
        IEnumerable<User> GetAllUsers();
        void UpdateUser(User user);
        void DeleteUser(int userid);
        User LoginUser(string email, string password);
        User SearchUser(int? userid,string email);

    }
}
