using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRP_DAL.Models;
using MRP_REPO.Repository;

namespace MRP_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScreenAPIController : ControllerBase
    {
        private readonly IScreen _screenRepo;

        public ScreenAPIController(IScreen screenRepo)
        {
            _screenRepo = screenRepo;
        }

        // GET: api/ScreenAPI/GetAllScreens
        [HttpGet("GetAllScreens")]
   
        public IActionResult GetAllScreens()
        {
            var screens = _screenRepo.GetAllScreens();
            return Ok(screens);
        }

        // POST: api/ScreenAPI/AddScreen
        [HttpPost("AddScreen")]
    
        public IActionResult AddScreen([FromBody] Screen screen)
        {
            if (screen == null)
                return BadRequest("Screen data is null");

            _screenRepo.AddScreen(screen);
            return Ok("Screen added successfully");
        }
        [Authorize]
        // PUT: api/ScreenAPI/UpdateScreen
        [HttpPut("UpdateScreen")]
        public IActionResult UpdateScreen([FromBody] Screen screen)
        {
            if (screen == null)
                return BadRequest("Screen data is null");

            _screenRepo.UpdateScreen(screen);
            return Ok("Screen updated successfully");
        }

        // DELETE: api/ScreenAPI/DeleteScreen/{id}
        [HttpDelete("DeleteScreen/{id}")]

        public IActionResult DeleteScreen(int id)
        {
            _screenRepo.DeleteScreen(id);
            return Ok("Screen deleted successfully");
        }
    }
}
