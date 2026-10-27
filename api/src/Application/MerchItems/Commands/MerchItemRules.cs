using Domain.Common;
using Domain.MerchItems;
using FluentValidation;

namespace Application.MerchItems.Commands;

/// <summary>
/// Validation rules shared by create and update commands.
/// </summary>
public static class MerchItemRules
{
    public const int NameMaxLength = 120;
    public const int DescriptionMaxLength = 2000;
    public const int MaxColors = 20;

    public static IRuleBuilderOptions<T, string> ValidName<T>(this IRuleBuilder<T, string> rule)
        => rule
            .NotEmpty().WithMessage("Name is required.")
            .MinimumLength(2)
            .MaximumLength(NameMaxLength)
            .WithMessage($"Name must be between 2 and {NameMaxLength} characters.");

    public static IRuleBuilderOptions<T, string?> ValidDescription<T>(this IRuleBuilder<T, string?> rule)
        => rule
            .MaximumLength(DescriptionMaxLength)
            .WithMessage($"Description must be at most {DescriptionMaxLength} characters.");

    public static IRuleBuilderOptions<T, string> ValidMerchCategory<T>(this IRuleBuilder<T, string> rule)
        => rule
            .Must(c => MerchCategory.AllCategoryNames.Contains(c))
            .WithMessage($"Category must be one of: {string.Join(", ", MerchCategory.AllCategoryNames)}.");

    public static IRuleBuilderOptions<T, List<string>> ValidColors<T>(this IRuleBuilder<T, List<string>> rule)
        => rule
            .NotEmpty().WithMessage("At least one available color is required.")
            .Must(colors => colors.Count <= MaxColors).WithMessage($"At most {MaxColors} colors are allowed.")
            .Must(colors => colors.All(HexColor.IsValid)).WithMessage("Colors must be in #RRGGBB format.");

    public static List<string> NormalizeColors(IEnumerable<string> colors)
        => colors.Select(HexColor.Normalize).Distinct().ToList();
}
