using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.MerchItems.Exceptions;
using Application.Services.FileStorage;
using Domain.MerchItems;
using MediatR;

namespace Application.MerchItems.Commands;

public record DeleteMerchItemCommand : IRequest<Result<MerchItem, MerchItemException>>
{
    public required Guid MerchItemId { get; init; }
}

public class DeleteMerchItemCommandHandler(
    IMerchItemRepository merchItemRepository,
    IFileService fileService)
    : IRequestHandler<DeleteMerchItemCommand, Result<MerchItem, MerchItemException>>
{
    public async Task<Result<MerchItem, MerchItemException>> Handle(DeleteMerchItemCommand request,
        CancellationToken cancellationToken)
    {
        var merchItemId = new MerchItemId(request.MerchItemId);
        var existingMerchItem = await merchItemRepository.GetById(merchItemId, cancellationToken);

        return await existingMerchItem.Match(
            async merchItem => await DeleteEntity(merchItem, cancellationToken),
            () => Task.FromResult<Result<MerchItem, MerchItemException>>(
                new MerchItemNotFoundException(merchItemId)));
    }

    private async Task<Result<MerchItem, MerchItemException>> DeleteEntity(MerchItem merchItem,
        CancellationToken cancellationToken)
    {
        if (await merchItemRepository.IsUsedInConfigurations(merchItem.Id, cancellationToken))
        {
            return new MerchItemHasConfigurationsException(merchItem.Id);
        }

        try
        {
            await merchItemRepository.Delete(merchItem, cancellationToken);
        }
        catch (Exception exception)
        {
            return new MerchItemUnknownException(merchItem.Id, exception);
        }

        // Files are removed only after the DB row is gone, so a failed delete never leaves a broken item.
        foreach (var fileKey in new[] { merchItem.ModelFilePath, merchItem.PreviewImagePath })
        {
            if (!string.IsNullOrEmpty(fileKey))
                await fileService.DeleteAsync(fileKey, cancellationToken);
        }

        return merchItem;
    }
}
