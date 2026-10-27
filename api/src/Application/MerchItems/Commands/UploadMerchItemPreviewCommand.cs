using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.MerchItems.Exceptions;
using Application.Services.FileStorage;
using Domain.MerchItems;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.MerchItems.Commands;

public record UploadMerchItemPreviewCommand : IRequest<Result<MerchItem, MerchItemException>>
{
    public required Guid MerchItemId { get; init; }
    public required IFormFile PreviewFile { get; init; }
}

public class UploadMerchItemPreviewCommandHandler(
    IMerchItemRepository merchItemRepository,
    IFileService fileService)
    : IRequestHandler<UploadMerchItemPreviewCommand, Result<MerchItem, MerchItemException>>
{
    public async Task<Result<MerchItem, MerchItemException>> Handle(UploadMerchItemPreviewCommand request,
        CancellationToken cancellationToken)
    {
        var merchItemId = new MerchItemId(request.MerchItemId);
        var existingMerchItem = await merchItemRepository.GetById(merchItemId, cancellationToken);

        return await existingMerchItem.Match(
            async merchItem => await UploadPreview(merchItem, request.PreviewFile, cancellationToken),
            () => Task.FromResult<Result<MerchItem, MerchItemException>>(
                new MerchItemNotFoundException(merchItemId)));
    }

    private async Task<Result<MerchItem, MerchItemException>> UploadPreview(MerchItem merchItem,
        IFormFile previewFile, CancellationToken cancellationToken)
    {
        var saveResult = await fileService.SaveAsync(FileKind.PreviewImage, previewFile, merchItem.PreviewImagePath,
            cancellationToken);

        return await saveResult.Match<Task<Result<MerchItem, MerchItemException>>>(
            async storedFile =>
            {
                merchItem.SetPreview(storedFile.Key);

                try
                {
                    return await merchItemRepository.Update(merchItem, cancellationToken);
                }
                catch (Exception exception)
                {
                    return new MerchItemUnknownException(merchItem.Id, exception);
                }
            },
            error => Task.FromResult<Result<MerchItem, MerchItemException>>(
                new MerchItemFileException(merchItem.Id, error)));
    }
}
