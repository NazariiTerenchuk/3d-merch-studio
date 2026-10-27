using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.Prints.Exceptions;
using Application.Services.FileStorage;
using Domain.Prints;
using MediatR;

namespace Application.Prints.Commands;

public record DeletePrintCommand : IRequest<Result<Print, PrintException>>
{
    public required Guid PrintId { get; init; }
}

public class DeletePrintCommandHandler(IPrintRepository printRepository, IFileService fileService)
    : IRequestHandler<DeletePrintCommand, Result<Print, PrintException>>
{
    public async Task<Result<Print, PrintException>> Handle(DeletePrintCommand request,
        CancellationToken cancellationToken)
    {
        var printId = new PrintId(request.PrintId);
        var existingPrint = await printRepository.GetById(printId, cancellationToken);

        return await existingPrint.Match(
            async print => await DeleteEntity(print, cancellationToken),
            () => Task.FromResult<Result<Print, PrintException>>(new PrintNotFoundException(printId)));
    }

    private async Task<Result<Print, PrintException>> DeleteEntity(Print print, CancellationToken cancellationToken)
    {
        if (await printRepository.IsUsedInConfigurations(print.Id, cancellationToken))
        {
            return new PrintHasConfigurationsException(print.Id);
        }

        try
        {
            await printRepository.Delete(print, cancellationToken);
        }
        catch (Exception exception)
        {
            return new PrintUnknownException(print.Id, exception);
        }

        if (!string.IsNullOrEmpty(print.ImageFilePath))
            await fileService.DeleteAsync(print.ImageFilePath, cancellationToken);

        return print;
    }
}
