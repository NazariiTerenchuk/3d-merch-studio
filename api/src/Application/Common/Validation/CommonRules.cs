using FluentValidation;

namespace Application.Common.Validation;

public static class CommonRules
{
    public const int NameMaxLength = 120;
    public const int DescriptionMaxLength = 2000;

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
}
