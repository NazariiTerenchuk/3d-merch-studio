namespace Domain.Configurations;

public record ConfigurationPrintId(Guid Value)
{
    public static ConfigurationPrintId New() => new(Guid.NewGuid());
    public static ConfigurationPrintId Empty => new(Guid.Empty);
    public override string ToString() => Value.ToString();
}
