using Application.Common.Validation;
using FluentValidation;

namespace Application.Configurations.Commands;

public class CreateSavedConfigurationCommandValidator : AbstractValidator<CreateSavedConfigurationCommand>
{
    public CreateSavedConfigurationCommandValidator()
    {
        RuleFor(x => x.Name).ValidName();
        RuleFor(x => x.MerchItemId).NotEmpty();
        RuleFor(x => x.BaseColor).ValidBaseColor();
        RuleFor(x => x.Prints).ValidPrintsCount();
        RuleForEach(x => x.Prints).SetValidator(new ConfigurationPrintInputValidator());
    }
}
