using Domain.Common;

namespace Domain.Prints;

public class PrintCategoryConstants
{
    public const string Logo = "Логотип";
    public const string Emblem = "Емблема";
    public const string Lettering = "Напис";
    public const string Pattern = "Патерн";
    public const string Other = "Інше";
}

public class PrintCategory : ValueObject
{
    public string Value { get; }

    private PrintCategory(string value)
    {
        Value = value;
    }

    public static PrintCategory From(string value)
    {
        var category = new PrintCategory(value);

        if (!SupportedCategories.Contains(category))
        {
            throw new UnsupportedPrintCategoryException(value);
        }

        return category;
    }

    public static PrintCategory Logo => new(PrintCategoryConstants.Logo);
    public static PrintCategory Emblem => new(PrintCategoryConstants.Emblem);
    public static PrintCategory Lettering => new(PrintCategoryConstants.Lettering);
    public static PrintCategory Pattern => new(PrintCategoryConstants.Pattern);
    public static PrintCategory Other => new(PrintCategoryConstants.Other);

    public static implicit operator string(PrintCategory category)
    {
        return category.ToString();
    }

    public static explicit operator PrintCategory(string value)
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

    public static IEnumerable<PrintCategory> SupportedCategories
    {
        get
        {
            yield return Logo;
            yield return Emblem;
            yield return Lettering;
            yield return Pattern;
            yield return Other;
        }
    }

    public static IEnumerable<string> AllCategoryNames => SupportedCategories.Select(c => c.Value);
}

public class UnsupportedPrintCategoryException : Exception
{
    public UnsupportedPrintCategoryException(string category)
        : base($"Print category '{category}' is not supported.") { }
}
