using FluentValidation;

namespace Application.MerchItems.Commands;

public class UpdateMerchItemCommandValidator : AbstractValidator<UpdateMerchItemCommand>
{
    public UpdateMerchItemCommandValidator()
    {
        RuleFor(x => x.MerchItemId).NotEmpty();
        RuleFor(x => x.Name).ValidName();
        RuleFor(x => x.Description).ValidDescription();
        RuleFor(x => x.Category).ValidMerchCategory();
        RuleFor(x => x.AvailableColors).ValidColors();
    }
}
