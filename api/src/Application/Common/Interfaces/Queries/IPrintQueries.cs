using Domain.Prints;
using Optional;

namespace Application.Common.Interfaces.Queries;

public interface IPrintQueries
{
    Task<IReadOnlyList<Print>> GetAll(PrintCategory? category, bool onlyActive, CancellationToken cancellationToken);
    Task<Option<Print>> GetById(PrintId id, CancellationToken cancellationToken);
}
