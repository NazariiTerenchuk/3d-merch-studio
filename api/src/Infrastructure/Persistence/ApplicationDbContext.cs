using System.Reflection;
using Domain.Configurations;
using Domain.MerchItems;
using Domain.Prints;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<MerchItem> MerchItems { get; set; }
    public DbSet<Print> Prints { get; set; }
    public DbSet<SavedConfiguration> SavedConfigurations { get; set; }
    public DbSet<ConfigurationPrint> ConfigurationPrints { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
    }
}
