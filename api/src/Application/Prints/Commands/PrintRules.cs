using Domain.Prints;
using FluentValidation;

namespace Application.Prints.Commands;

public static class PrintRules
{
    public static IRuleBuilderOptions<T, string> ValidPrintCategory<T>(this IRuleBuilder<T, string> rule)
        => rule
            .Must(c => PrintCategory.AllCategoryNames.Contains(c))
            .WithMessage($"Category must be one of: {string.Join(", ", PrintCategory.AllCategoryNames)}.");
}
