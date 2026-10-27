using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.MerchItems.Exceptions;
using Application.Services.FileStorage;
using Domain.MerchItems;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.MerchItems.Commands;

public record UploadMerchItemModelCommand : IRequest<Result<MerchItem, MerchItemException>>
{
    public required Guid MerchItemId { get; init; }
    public required IFormFile ModelFile { get; init; }
}

public class UploadMerchItemModelCommandHandler(
    IMerchItemRepository merchItemRepository,
    IFileService fileService)
    : IRequestHandler<UploadMerchItemModelCommand, Result<MerchItem, MerchItemException>>
{
    public async Task<Result<MerchItem, MerchItemException>> Handle(UploadMerchItemModelCommand request,
        CancellationToken cancellationToken)
    {
        var merchItemId = new MerchItemId(request.MerchItemId);
        var existingMerchItem = await merchItemRepository.GetById(merchItemId, cancellationToken);

        return await existingMerchItem.Match(
            async merchItem => await UploadModel(merchItem, request.ModelFile, cancellationToken),
            () => Task.FromResult<Result<MerchItem, MerchItemException>>(
                new MerchItemNotFoundException(merchItemId)));
    }

    private async Task<Result<MerchItem, MerchItemException>> UploadModel(MerchItem merchItem, IFormFile modelFile,
        CancellationToken cancellationToken)
    {
        var saveResult = await fileService.SaveAsync(FileKind.Model3D, modelFile, merchItem.ModelFilePath,
            cancellationToken);

        return await saveResult.Match<Task<Result<MerchItem, MerchItemException>>>(
            async storedFile =>
            {
                merchItem.SetModel(storedFile.Key);

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
