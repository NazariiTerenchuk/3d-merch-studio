using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Persistence;

public class ApplicationDbContextInitialiser(
    ApplicationDbContext context,
    ILogger<ApplicationDbContextInitialiser> logger)
{
    public async Task InitializeAsync()
    {
        try
        {
            logger.LogInformation("Checking database connection and applying migrations...");
            await context.Database.MigrateAsync();
            logger.LogInformation("Migrations applied successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while initializing the database.");
            throw;
        }
    }
}
