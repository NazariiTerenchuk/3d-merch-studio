using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.MerchItems.Exceptions;
using Domain.MerchItems;
using MediatR;

namespace Application.MerchItems.Commands;

public record CreateMerchItemCommand : IRequest<Result<MerchItem, MerchItemException>>
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required string Category { get; init; }
    public required List<string> AvailableColors { get; init; }
}

public class CreateMerchItemCommandHandler(IMerchItemRepository merchItemRepository)
    : IRequestHandler<CreateMerchItemCommand, Result<MerchItem, MerchItemException>>
{
    public async Task<Result<MerchItem, MerchItemException>> Handle(CreateMerchItemCommand request,
        CancellationToken cancellationToken)
    {
        var id = MerchItemId.New();

        try
        {
            var merchItem = MerchItem.New(
                id,
                request.Name.Trim(),
                request.Description?.Trim(),
                MerchCategory.From(request.Category),
                MerchItemRules.NormalizeColors(request.AvailableColors));

            return await merchItemRepository.Add(merchItem, cancellationToken);
        }
        catch (Exception exception)
        {
            return new MerchItemUnknownException(id, exception);
        }
    }
}
