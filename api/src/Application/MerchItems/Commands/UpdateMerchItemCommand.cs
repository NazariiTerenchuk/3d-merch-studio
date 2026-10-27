using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.MerchItems.Exceptions;
using Domain.MerchItems;
using MediatR;

namespace Application.MerchItems.Commands;

public record UpdateMerchItemCommand : IRequest<Result<MerchItem, MerchItemException>>
{
    public required Guid MerchItemId { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required string Category { get; init; }
    public required List<string> AvailableColors { get; init; }
    public required bool IsActive { get; init; }
}

public class UpdateMerchItemCommandHandler(IMerchItemRepository merchItemRepository)
    : IRequestHandler<UpdateMerchItemCommand, Result<MerchItem, MerchItemException>>
{
    public async Task<Result<MerchItem, MerchItemException>> Handle(UpdateMerchItemCommand request,
        CancellationToken cancellationToken)
    {
        var merchItemId = new MerchItemId(request.MerchItemId);
        var existingMerchItem = await merchItemRepository.GetById(merchItemId, cancellationToken);

        return await existingMerchItem.Match(
            async merchItem => await UpdateEntity(merchItem, request, cancellationToken),
            () => Task.FromResult<Result<MerchItem, MerchItemException>>(
                new MerchItemNotFoundException(merchItemId)));
    }

    private async Task<Result<MerchItem, MerchItemException>> UpdateEntity(MerchItem merchItem,
        UpdateMerchItemCommand request, CancellationToken cancellationToken)
    {
        try
        {
            merchItem.Update(
                request.Name.Trim(),
                request.Description?.Trim(),
                MerchCategory.From(request.Category),
                MerchItemRules.NormalizeColors(request.AvailableColors));

            if (request.IsActive)
                merchItem.Activate();
            else
                merchItem.Deactivate();

            return await merchItemRepository.Update(merchItem, cancellationToken);
        }
        catch (Exception exception)
        {
            return new MerchItemUnknownException(merchItem.Id, exception);
        }
    }
}
