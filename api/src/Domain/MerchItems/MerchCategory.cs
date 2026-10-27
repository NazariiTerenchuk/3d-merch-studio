using Domain.Common;

namespace Domain.MerchItems;

public class MerchCategoryConstants
{
    public const string TShirt = "Футболка";
    public const string Hoodie = "Худі";
    public const string Sweatshirt = "Світшот";
    public const string Cap = "Кепка";
    public const string Tote = "Шопер";
    public const string Other = "Інше";
}

public class MerchCategory : ValueObject
{
    public string Value { get; }

    private MerchCategory(string value)
    {
        Value = value;
    }

    public static MerchCategory From(string value)
    {
        var category = new MerchCategory(value);

        if (!SupportedCategories.Contains(category))
        {
            throw new UnsupportedMerchCategoryException(value);
        }

        return category;
    }

    public static MerchCategory TShirt => new(MerchCategoryConstants.TShirt);
    public static MerchCategory Hoodie => new(MerchCategoryConstants.Hoodie);
    public static MerchCategory Sweatshirt => new(MerchCategoryConstants.Sweatshirt);
    public static MerchCategory Cap => new(MerchCategoryConstants.Cap);
    public static MerchCategory Tote => new(MerchCategoryConstants.Tote);
    public static MerchCategory Other => new(MerchCategoryConstants.Other);

    public static implicit operator string(MerchCategory category)
    {
        return category.ToString();
    }

    public static explicit operator MerchCategory(string value)
    {
        return From(value);
    }

    public override string ToString()
    {
        return Value;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public static IEnumerable<MerchCategory> SupportedCategories
    {
        get
        {
            yield return TShirt;
            yield return Hoodie;
            yield return Sweatshirt;
            yield return Cap;
            yield return Tote;
            yield return Other;
        }
    }

    public static IEnumerable<string> AllCategoryNames => SupportedCategories.Select(c => c.Value);
}

public class UnsupportedMerchCategoryException : Exception
{
    public UnsupportedMerchCategoryException(string category)
        : base($"Merch category '{category}' is not supported.") { }
}
