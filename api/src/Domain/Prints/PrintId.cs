namespace Domain.Prints;

public record PrintId(Guid Value)
{
    public static PrintId New() => new(Guid.NewGuid());
    public static PrintId Empty => new(Guid.Empty);
    public override string ToString() => Value.ToString();
}
