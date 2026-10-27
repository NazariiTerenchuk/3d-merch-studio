using Domain.Common;
using Domain.Configurations;
using FluentValidation;

namespace Application.Configurations.Commands;

public static class ConfigurationRules
{
    public const int MaxPrints = 20;
    public const float MaxRotation = 360f;

    public static IRuleBuilderOptions<T, string> ValidBaseColor<T>(this IRuleBuilder<T, string> rule)
        => rule
            .Must(HexColor.IsValid)
            .WithMessage("Base color must be in #RRGGBB format.");

    public static IRuleBuilderOptions<T, List<ConfigurationPrintInput>> ValidPrintsCount<T>(
        this IRuleBuilder<T, List<ConfigurationPrintInput>> rule)
        => rule
            .NotNull()
            .Must(prints => prints.Count <= MaxPrints)
            .WithMessage($"At most {MaxPrints} prints are allowed.");
}

public class ConfigurationPrintInputValidator : AbstractValidator<ConfigurationPrintInput>
{
    public ConfigurationPrintInputValidator()
    {
        RuleFor(x => x.PrintId).NotEmpty();

        RuleFor(x => x.Placement)
            .Must(p => PrintPlacement.AllPlacementNames.Contains(p))
            .WithMessage($"Placement must be one of: {string.Join(", ", PrintPlacement.AllPlacementNames)}.");

        RuleFor(x => x.OffsetX)
            .InclusiveBetween(ConfigurationPrint.MinOffset, ConfigurationPrint.MaxOffset);

        RuleFor(x => x.OffsetY)
            .InclusiveBetween(ConfigurationPrint.MinOffset, ConfigurationPrint.MaxOffset);

        RuleFor(x => x.Scale)
            .InclusiveBetween(ConfigurationPrint.MinScale, ConfigurationPrint.MaxScale);

        RuleFor(x => x.Rotation)
            .InclusiveBetween(-ConfigurationRules.MaxRotation, ConfigurationRules.MaxRotation);

        RuleFor(x => x.ZIndex)
            .InclusiveBetween(0, ConfigurationRules.MaxPrints * 10);
    }
}
