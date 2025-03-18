using System;
using System.ComponentModel.DataAnnotations;

namespace StudioCentral.Models
{
    public class Lesson
    {
        public int Id { get; set; }

        [Required]
        public required string StudentName { get; set; }

        [Required]
        [EmailAddress]
        public required string StudentEmail { get; set; }

        [Required]
        [Phone]
        public required string StudentPhone { get; set; }

        [Required]
        public DateTime LessonDateTime { get; set; }

        [Required]
        public required string TeacherName { get; set; }

        [Required]
        public required string LessonType { get; set; }

        public string? Notes { get; set; }

        public bool IsConfirmed { get; set; } = false;
    }
} 