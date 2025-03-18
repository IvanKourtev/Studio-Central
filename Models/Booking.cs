using System;
using System.ComponentModel.DataAnnotations;

namespace StudioCentral.Models
{
    public class Booking
    {
        public int Id { get; set; }

        [Required]
        public required string FullName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [Phone]
        public required string Phone { get; set; }

        [Required]
        public required string LessonType { get; set; }

        [Required]
        public DateTime PreferredDate { get; set; }

        public string? Notes { get; set; }

        public bool IsConfirmed { get; set; } = false;
    }
}
