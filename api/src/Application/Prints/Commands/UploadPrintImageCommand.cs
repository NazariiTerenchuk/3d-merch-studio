using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.Prints.Exceptions;
using Application.Services.FileStorage;
using Domain.Prints;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Prints.Commands;

public record UploadPrintImageCommand : IRequest<Result<Print, PrintException>>
{
    public required Guid PrintId { get; init; }
    public required IFormFile ImageFile { get; init; }
}

public class UploadPrintImageCommandHandler(IPrintRepository printRepository, IFileService fileService)
    : IRequestHandler<UploadPrintImageCommand, Result<Print, PrintException>>
{
    public async Task<Result<Print, PrintException>> Handle(UploadPrintImageCommand request,
        CancellationToken cancellationToken)
    {
        var printId = new PrintId(request.PrintId);
        var existingPrint = await printRepository.GetById(printId, cancellationToken);

        return await existingPrint.Match(
            async print => await UploadImage(print, request.ImageFile, cancellationToken),
            () => Task.FromResult<Result<Print, PrintException>>(new PrintNotFoundException(printId)));
    }

    private async Task<Result<Print, PrintException>> UploadImage(Print print, IFormFile imageFile,
        CancellationToken cancellationToken)
    {
        var saveResult = await fileService.SaveAsync(FileKind.PrintImage, imageFile, print.ImageFilePath,
            cancellationToken);

        return await saveResult.Match<Task<Result<Print, PrintException>>>(
            async storedFile =>
            {
                // Size is read from the PNG header; the 3D decal needs it for the aspect ratio.
                if (storedFile.WidthPx is not { } width || storedFile.HeightPx is not { } height)
                {
                    await fileService.DeleteAsync(storedFile.Key, cancellationToken);
                    return new PrintFileException(print.Id, new InvalidFileContentException(".png"));
                }

                print.SetImage(storedFile.Key, width, height);

                try
                {
                    return await printRepository.Update(print, cancellationToken);
                }
                catch (Exception exception)
                {
                    return new PrintUnknownException(print.Id, exception);
                }
            },
            error => Task.FromResult<Result<Print, PrintException>>(new PrintFileException(print.Id, error)));
    }
}
