using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MRP_API.Models;
using MRP_DAL.Models;
using MRP_REPO.Repository;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MRP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminAuthController : ControllerBase
    {
        private readonly IAdmin _admin;
        private readonly JwtOption _options;

        public AdminAuthController(IAdmin admin, IOptions<JwtOption> options)
        {
            _admin = admin;
            _options = options.Value;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO model)
        {
            var admin = _admin.LoginAdmin(model.Email, model.Password);
            if (admin == null)
            {
                return BadRequest(new { error = "Email or password is incorrect." });
            }

            var token = GenerateJwtToken(admin);
            return Ok(new { token });
        }

        private string GenerateJwtToken(Admin admin)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                // <<< IMPORTANT: include adminId >>>
                new Claim("adminId", admin.AdminId.ToString()),
                new Claim(ClaimTypes.Email, admin.Email),
                new Claim(ClaimTypes.Role, "Admin")
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
