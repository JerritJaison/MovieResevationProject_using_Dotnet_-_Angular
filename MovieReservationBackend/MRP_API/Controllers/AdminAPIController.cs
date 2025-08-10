using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MRP_DAL.Models;
using MRP_REPO.Repository;

namespace MRP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminAPIController : ControllerBase
    {
        private readonly IAdmin _admin;

        public AdminAPIController(IAdmin admin)
        {
            _admin = admin;
        }

        [HttpPost("Register")]
        public IActionResult AddAdmin([FromBody] Admin admin)
        {
            _admin.AddAdmin(admin);
            return Ok("Admin added successfully.");
        }

        [HttpPut("UpdateAdmin")]
        [Authorize]
        public IActionResult UpdateAdmin([FromBody] Admin admin)
        {
            try
            {
                _admin.UpdateAdmin(admin);
                return Ok("Admin updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Update failed: {ex.Message}");
            }
        }


        [HttpDelete("DeleteAdmin/{id}")]
        [Authorize]
        public IActionResult DeleteAdmin(int id)
        {
            _admin.DeleteAdmin(id);
            return Ok("Admin deleted successfully.");
        }

        [HttpGet("GetAllAdmins")]
        [Authorize]
        public IActionResult GetAllAdmins()
        {
            var admins = _admin.GetAllAdmins();
            return Ok(admins);
        }

        [HttpGet("GetAdminById/{id}")]
        [Authorize]
        public IActionResult GetAdminById(int id)
        {
            var admin = _admin.GetAdminById(id);
            if (admin == null)
                return NotFound($"Admin with ID {id} not found.");

            return Ok(admin);
        }
    }
}
