using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MRP_API.Models;
using MRP_DAL.Models;          // <-- make sure this namespace is correct for your User entity
using MRP_REPO.Repository;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MRP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAuthController : ControllerBase
    {
        private readonly IUser _user;
        private readonly JwtOption _options;

        public UserAuthController(IUser user, IOptions<JwtOption> options)
        {
            _user = user;
            _options = options.Value;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO model)
        {
            var user = _user.LoginUser(model.Email, model.Password);
            if (user == null)
            {
                return BadRequest(new { error = "Email or password is incorrect." });
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                // IMPORTANT: include userId so the client can read it back
                new Claim("userId", user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name ?? user.Email),
                new Claim(ClaimTypes.Role, "User")
            };

            var jwt = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Issuer,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}
