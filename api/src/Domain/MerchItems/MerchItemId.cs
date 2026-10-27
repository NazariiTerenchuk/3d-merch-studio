namespace Domain.MerchItems;

public record MerchItemId(Guid Value)
{
    public static MerchItemId New() => new(Guid.NewGuid());
    public static MerchItemId Empty => new(Guid.Empty);
    public override string ToString() => Value.ToString();
}
