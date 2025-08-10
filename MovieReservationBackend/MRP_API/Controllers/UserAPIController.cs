using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRP_DAL.Models;
using MRP_REPO.Repository;
using System.Collections.Generic;
namespace MRP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class UsersAPIController : ControllerBase
    {
        private readonly IUser _user;
        public UsersAPIController(IUser user)
        {
            _user = user;
        }
        // POST: api/Users/Register
        [HttpPost("Register")]
        public IActionResult RegisterUser([FromBody] User user)
        {
            _user.RegisterUser(user);
            return Ok("User registered successfully.");
        }

        //// POST: api/Users/Login
        //[HttpPost("Login")]
   
        //public IActionResult LoginUser([FromBody] User loginUser)
        //{
        //    var result = _user.LoginUser(loginUser.Email, loginUser.Password);
        //    if (result == null)
        //        return Unauthorized("Invalid credentials.");
        //    return Ok(result);
        //}
        // GET: api/Users/{id}
        [HttpGet("{id}")]
     
        public IActionResult GetUserById(int id)
        {
            var user = _user.SearchUser(id,null);
            if (user == null)
                return NotFound();
            return Ok(user);
        }
        [Authorize]
        // GET: api/Users/Search?email=abc@example.com
        [HttpGet("Search")]
        
        public IActionResult SearchUser(int? id, string email)
        {
            var user = _user.SearchUser(id, email);
            if (user == null)
                return NotFound();
            return Ok(user);
        }
        // GET: api/Users
        [HttpGet]
      
        public IActionResult GetAllUsers()
        {
            var users = _user.GetAllUsers();
            return Ok(users);
        }
        // PUT: api/Users/Update
        [HttpPut("Update")]
      
        public IActionResult UpdateUser([FromBody] User user)
        {
            _user.UpdateUser(user);
            return Ok("User updated successfully.");
        }
        // DELETE: api/Users/Delete/{id}
        [HttpDelete("Delete/{id}")]
      
        public IActionResult DeleteUser(int id)
        {
            _user.DeleteUser(id);
            return Ok("User deleted successfully.");
        }
    }
}
