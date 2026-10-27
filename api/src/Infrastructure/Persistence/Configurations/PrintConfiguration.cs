using Domain.Prints;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class PrintConfiguration : IEntityTypeConfiguration<Print>
{
    public void Configure(EntityTypeBuilder<Print> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id)
            .HasConversion(id => id.Value, value => new PrintId(value))
            .IsRequired();

        builder.Property(p => p.Name)
            .IsRequired()
            .HasColumnType("varchar(120)");

        builder.Property(p => p.Description)
            .HasColumnType("varchar(2000)");

        builder.Property(p => p.Category)
            .HasConversion(
                category => category.Value,
                value => PrintCategory.From(value))
            .IsRequired()
            .HasColumnType("varchar(50)");

        builder.Property(p => p.ImageFilePath)
            .HasColumnType("varchar(500)");

        builder.Property(p => p.IsActive)
            .IsRequired();

        builder.Property(p => p.CreatedAt)
            .HasConversion(new DateTimeUtcConverter())
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .HasConversion(new DateTimeUtcConverter())
            .IsRequired();

        builder.HasIndex(p => p.Category);
    }
}
