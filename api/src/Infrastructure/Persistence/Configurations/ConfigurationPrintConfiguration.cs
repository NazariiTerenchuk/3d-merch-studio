using Domain.Configurations;
using Domain.Prints;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ConfigurationPrintConfiguration : IEntityTypeConfiguration<ConfigurationPrint>
{
    public void Configure(EntityTypeBuilder<ConfigurationPrint> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id)
            .HasConversion(id => id.Value, value => new ConfigurationPrintId(value))
            .IsRequired();

        builder.Property(p => p.ConfigurationId)
            .HasConversion(id => id.Value, value => new SavedConfigurationId(value))
            .IsRequired();

        builder.Property(p => p.PrintId)
            .HasConversion(id => id.Value, value => new PrintId(value))
            .IsRequired();

        builder.HasOne(p => p.Print)
            .WithMany()
            .HasForeignKey(p => p.PrintId)
            .HasConstraintName("fk_configuration_prints_prints_id")
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(p => p.Placement)
            .HasConversion(
                placement => placement.Value,
                value => PrintPlacement.From(value))
            .IsRequired()
            .HasColumnType("varchar(30)");

        builder.Property(p => p.OffsetX).IsRequired();
        builder.Property(p => p.OffsetY).IsRequired();
        builder.Property(p => p.Scale).IsRequired();
        builder.Property(p => p.Rotation).IsRequired();
        builder.Property(p => p.ZIndex).IsRequired();
    }
}
