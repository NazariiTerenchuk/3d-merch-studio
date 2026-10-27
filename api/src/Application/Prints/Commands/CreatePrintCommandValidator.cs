using Application.Common.Validation;
using FluentValidation;

namespace Application.Prints.Commands;

public class CreatePrintCommandValidator : AbstractValidator<CreatePrintCommand>
{
    public CreatePrintCommandValidator()
    {
        RuleFor(x => x.Name).ValidName();
        RuleFor(x => x.Description).ValidDescription();
        RuleFor(x => x.Category).ValidPrintCategory();
    }
}
