using Application.Common.Validation;
using FluentValidation;

namespace Application.MerchItems.Commands;

public class CreateMerchItemCommandValidator : AbstractValidator<CreateMerchItemCommand>
{
    public CreateMerchItemCommandValidator()
    {
        RuleFor(x => x.Name).ValidName();
        RuleFor(x => x.Description).ValidDescription();
        RuleFor(x => x.Category).ValidMerchCategory();
        RuleFor(x => x.AvailableColors).ValidColors();
    }
}
