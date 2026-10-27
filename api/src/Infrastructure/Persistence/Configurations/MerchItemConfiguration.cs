using Domain.MerchItems;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class MerchItemConfiguration : IEntityTypeConfiguration<MerchItem>
{
    public void Configure(EntityTypeBuilder<MerchItem> builder)
    {
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id)
            .HasConversion(id => id.Value, value => new MerchItemId(value))
            .IsRequired();

        builder.Property(m => m.Name)
            .IsRequired()
            .HasColumnType("varchar(120)");

        builder.Property(m => m.Description)
            .HasColumnType("varchar(2000)");

        builder.Property(m => m.Category)
            .HasConversion(
                category => category.Value,
                value => MerchCategory.From(value))
            .IsRequired()
            .HasColumnType("varchar(50)");

        builder.Property(m => m.AvailableColors)
            .IsRequired()
            .HasColumnType("varchar(7)[]");

        builder.Property(m => m.ModelFilePath)
            .HasColumnType("varchar(500)");

        builder.Property(m => m.PreviewImagePath)
            .HasColumnType("varchar(500)");

        builder.Property(m => m.IsActive)
            .IsRequired();

        builder.Property(m => m.CreatedAt)
            .HasConversion(new DateTimeUtcConverter())
            .IsRequired();

        builder.Property(m => m.UpdatedAt)
            .HasConversion(new DateTimeUtcConverter())
            .IsRequired();

        builder.HasIndex(m => m.Category);
    }
}
