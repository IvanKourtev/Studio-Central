using Microsoft.EntityFrameworkCore;
using StudioCentral.Models;

namespace StudioCentral.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Lesson> Lessons { get; set; }
    }
} 