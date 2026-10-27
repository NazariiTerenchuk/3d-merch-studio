using Domain.Configurations;
using Domain.MerchItems;
using Infrastructure.Persistence.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class SavedConfigurationConfiguration : IEntityTypeConfiguration<SavedConfiguration>
{
    public void Configure(EntityTypeBuilder<SavedConfiguration> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id)
            .HasConversion(id => id.Value, value => new SavedConfigurationId(value))
            .IsRequired();

        builder.Property(c => c.Name)
            .IsRequired()
            .HasColumnType("varchar(120)");

        builder.Property(c => c.MerchItemId)
            .HasConversion(id => id.Value, value => new MerchItemId(value))
            .IsRequired();

        builder.HasOne(c => c.MerchItem)
            .WithMany()
            .HasForeignKey(c => c.MerchItemId)
            .HasConstraintName("fk_saved_configurations_merch_items_id")
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(c => c.BaseColor)
            .IsRequired()
            .HasColumnType("varchar(7)");

        builder.Property(c => c.ShareCode)
            .IsRequired()
            .HasColumnType($"varchar({ShareCodeGenerator.Length})");

        builder.HasIndex(c => c.ShareCode)
            .IsUnique();

        builder.HasMany(c => c.Prints)
            .WithOne(p => p.Configuration)
            .HasForeignKey(p => p.ConfigurationId)
            .HasConstraintName("fk_configuration_prints_saved_configurations_id")
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(c => c.CreatedAt)
            .HasConversion(new DateTimeUtcConverter())
            .IsRequired();

        builder.Property(c => c.UpdatedAt)
            .HasConversion(new DateTimeUtcConverter())
            .IsRequired();
    }
}
