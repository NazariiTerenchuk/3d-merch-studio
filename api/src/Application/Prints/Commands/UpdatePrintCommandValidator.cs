using Application.Common.Validation;
using FluentValidation;

namespace Application.Prints.Commands;

public class UpdatePrintCommandValidator : AbstractValidator<UpdatePrintCommand>
{
    public UpdatePrintCommandValidator()
    {
        RuleFor(x => x.PrintId).NotEmpty();
        RuleFor(x => x.Name).ValidName();
        RuleFor(x => x.Description).ValidDescription();
        RuleFor(x => x.Category).ValidPrintCategory();
    }
}
