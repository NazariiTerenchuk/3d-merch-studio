using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.Prints.Exceptions;
using Domain.Prints;
using MediatR;

namespace Application.Prints.Commands;

public record UpdatePrintCommand : IRequest<Result<Print, PrintException>>
{
    public required Guid PrintId { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required string Category { get; init; }
    public required bool IsActive { get; init; }
}

public class UpdatePrintCommandHandler(IPrintRepository printRepository)
    : IRequestHandler<UpdatePrintCommand, Result<Print, PrintException>>
{
    public async Task<Result<Print, PrintException>> Handle(UpdatePrintCommand request,
        CancellationToken cancellationToken)
    {
        var printId = new PrintId(request.PrintId);
        var existingPrint = await printRepository.GetById(printId, cancellationToken);

        return await existingPrint.Match(
            async print => await UpdateEntity(print, request, cancellationToken),
            () => Task.FromResult<Result<Print, PrintException>>(new PrintNotFoundException(printId)));
    }

    private async Task<Result<Print, PrintException>> UpdateEntity(Print print, UpdatePrintCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            print.Update(request.Name.Trim(), request.Description?.Trim(), PrintCategory.From(request.Category));

            if (request.IsActive)
                print.Activate();
            else
                print.Deactivate();

            return await printRepository.Update(print, cancellationToken);
        }
        catch (Exception exception)
        {
            return new PrintUnknownException(print.Id, exception);
        }
    }
}
