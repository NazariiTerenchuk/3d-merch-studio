using Domain.Prints;
using Optional;

namespace Application.Common.Interfaces.Repositories;

public interface IPrintRepository
{
    Task<Option<Print>> GetById(PrintId id, CancellationToken cancellationToken);
    Task<IReadOnlyList<Print>> GetByIds(IEnumerable<PrintId> ids, CancellationToken cancellationToken);
    Task<bool> IsUsedInConfigurations(PrintId id, CancellationToken cancellationToken);
    Task<Print> Add(Print print, CancellationToken cancellationToken);
    Task<Print> Update(Print print, CancellationToken cancellationToken);
    Task<Print> Delete(Print print, CancellationToken cancellationToken);
}
