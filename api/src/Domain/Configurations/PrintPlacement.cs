using Domain.Common;

namespace Domain.Configurations;

/// <summary>
/// Zone on the garment where a print is placed. Values are technical codes
/// that the 3D module maps to decal anchors on the model.
/// </summary>
public class PrintPlacementConstants
{
    public const string Front = "front";
    public const string Back = "back";
    public const string LeftSleeve = "left-sleeve";
    public const string RightSleeve = "right-sleeve";
    public const string Hood = "hood";
}

public class PrintPlacement : ValueObject
{
    public string Value { get; }

    private PrintPlacement(string value)
    {
        Value = value;
    }

    public static PrintPlacement From(string value)
    {
        var placement = new PrintPlacement(value);

        if (!SupportedPlacements.Contains(placement))
        {
            throw new UnsupportedPrintPlacementException(value);
        }

        return placement;
    }

    public static PrintPlacement Front => new(PrintPlacementConstants.Front);
    public static PrintPlacement Back => new(PrintPlacementConstants.Back);
    public static PrintPlacement LeftSleeve => new(PrintPlacementConstants.LeftSleeve);
    public static PrintPlacement RightSleeve => new(PrintPlacementConstants.RightSleeve);
    public static PrintPlacement Hood => new(PrintPlacementConstants.Hood);

    public static implicit operator string(PrintPlacement placement)
    {
        return placement.ToString();
    }

    public static explicit operator PrintPlacement(string value)
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

    public static IEnumerable<PrintPlacement> SupportedPlacements
    {
        get
        {
            yield return Front;
            yield return Back;
            yield return LeftSleeve;
            yield return RightSleeve;
            yield return Hood;
        }
    }

    public static IEnumerable<string> AllPlacementNames => SupportedPlacements.Select(p => p.Value);
}

public class UnsupportedPrintPlacementException : Exception
{
    public UnsupportedPrintPlacementException(string placement)
        : base($"Print placement '{placement}' is not supported.") { }
}
