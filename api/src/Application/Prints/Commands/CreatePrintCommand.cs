using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.Prints.Exceptions;
using Domain.Prints;
using MediatR;

namespace Application.Prints.Commands;

public record CreatePrintCommand : IRequest<Result<Print, PrintException>>
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required string Category { get; init; }
}

public class CreatePrintCommandHandler(IPrintRepository printRepository)
    : IRequestHandler<CreatePrintCommand, Result<Print, PrintException>>
{
    public async Task<Result<Print, PrintException>> Handle(CreatePrintCommand request,
        CancellationToken cancellationToken)
    {
        var id = PrintId.New();

        try
        {
            var print = Print.New(id, request.Name.Trim(), request.Description?.Trim(),
                PrintCategory.From(request.Category));

            return await printRepository.Add(print, cancellationToken);
        }
        catch (Exception exception)
        {
            return new PrintUnknownException(id, exception);
        }
    }
}
