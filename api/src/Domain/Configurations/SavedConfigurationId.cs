namespace Domain.Configurations;

public record SavedConfigurationId(Guid Value)
{
    public static SavedConfigurationId New() => new(Guid.NewGuid());
    public static SavedConfigurationId Empty => new(Guid.Empty);
    public override string ToString() => Value.ToString();
}
