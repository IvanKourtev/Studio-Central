using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Studio_Central.Controllers
{
    public class LessonsController : Controller
    {
        private readonly ILogger<LessonsController> _logger;

        public LessonsController(ILogger<LessonsController> logger)
        {
            _logger = logger;
        }

        public IActionResult Registration()
        {
            return View();
        }

        public IActionResult DateSelection()
        {
            return View();
        }
    }
} 