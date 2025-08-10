using MRP_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MRP_REPO.Repository
{
    public interface IAdmin
    {
        void UpdateAdmin(Admin admin);
        void DeleteAdmin(int adminid);
        void AddAdmin(Admin admin);
        Admin LoginAdmin(string email, string password);
        IEnumerable<Admin> GetAllAdmins();
        Admin GetAdminById(int adminid);
    }
}
