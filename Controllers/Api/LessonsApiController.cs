using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudioCentral.Data;
using StudioCentral.Models;
using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace Studio_Central.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<LessonsApiController> _logger;

        public LessonsApiController(ApplicationDbContext context, ILogger<LessonsApiController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("GetAvailableDays")]
        public async Task<IActionResult> GetAvailableDays(DateTime startDate, DateTime endDate)
        {
            _logger.LogInformation($"GetAvailableDays called with startDate: {startDate} and endDate: {endDate}");
            
            var bookedDays = await _context.Lessons
                .Where(l => l.LessonDateTime.Date >= startDate.Date && l.LessonDateTime.Date <= endDate.Date)
                .GroupBy(l => l.LessonDateTime.Date)
                .Where(g => g.Count() >= 9) // Ако има 9 или повече записани часа, денят е зает
                .Select(g => g.Key.ToString("yyyy-MM-dd"))
                .ToListAsync();

            _logger.LogInformation($"Found {bookedDays.Count} booked days");
            return Ok(bookedDays);
        }

        [HttpGet("GetAvailableSlots")]
        public async Task<IActionResult> GetAvailableSlots(DateTime date)
        {
            _logger.LogInformation($"GetAvailableSlots called with date: {date}");
            
            try 
            {
                var bookedSlots = await _context.Lessons
                    .Where(l => l.LessonDateTime.Date == date.Date)
                    .Select(l => l.LessonDateTime.ToString("HH:mm"))
                    .ToListAsync();

                _logger.LogInformation($"Found {bookedSlots.Count} booked slots for date {date}");
                return Ok(bookedSlots);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in GetAvailableSlots: {ex.Message}");
                return StatusCode(500, new { error = "Възникна грешка при взимане на наличните часове" });
            }
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] Lesson lesson)
        {
            _logger.LogInformation($"Create lesson called with data: {System.Text.Json.JsonSerializer.Serialize(lesson)}");
            
            if (!ModelState.IsValid)
            {
                _logger.LogWarning($"Invalid model state: {string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))}");
                return BadRequest(ModelState);
            }

            // Проверяваме дали часът вече е зает
            var existingLesson = await _context.Lessons
                .FirstOrDefaultAsync(l => l.LessonDateTime == lesson.LessonDateTime);

            if (existingLesson != null)
            {
                _logger.LogWarning($"Attempted to book already booked time slot: {lesson.LessonDateTime}");
                return BadRequest("Този час вече е зает.");
            }

            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Successfully created lesson for {lesson.LessonDateTime}");
            return Ok(new { message = "Урокът е успешно запазен!" });
        }
    }
} 