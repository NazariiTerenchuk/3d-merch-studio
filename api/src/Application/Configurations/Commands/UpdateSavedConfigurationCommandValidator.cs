using Application.Common.Validation;
using FluentValidation;

namespace Application.Configurations.Commands;

public class UpdateSavedConfigurationCommandValidator : AbstractValidator<UpdateSavedConfigurationCommand>
{
    public UpdateSavedConfigurationCommandValidator()
    {
        RuleFor(x => x.ConfigurationId).NotEmpty();
        RuleFor(x => x.Name).ValidName();
        RuleFor(x => x.BaseColor).ValidBaseColor();
        RuleFor(x => x.Prints).ValidPrintsCount();
        RuleForEach(x => x.Prints).SetValidator(new ConfigurationPrintInputValidator());
    }
}
