using System.Text.RegularExpressions;

namespace Domain.Common;

public static partial class HexColor
{
    [GeneratedRegex("^#[0-9A-Fa-f]{6}$")]
    private static partial Regex HexColorRegex();

    public static bool IsValid(string? value)
        => value != null && HexColorRegex().IsMatch(value);

    public static string Normalize(string value)
        => value.ToUpperInvariant();
}
