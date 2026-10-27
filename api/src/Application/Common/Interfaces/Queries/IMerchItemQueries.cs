using Domain.MerchItems;
using Optional;

namespace Application.Common.Interfaces.Queries;

public interface IMerchItemQueries
{
    Task<IReadOnlyList<MerchItem>> GetAll(MerchCategory? category, bool onlyActive,
        CancellationToken cancellationToken);

    Task<(IReadOnlyList<MerchItem> Items, int TotalCount)> GetPaged(int page, int pageSize,
        CancellationToken cancellationToken);

    Task<Option<MerchItem>> GetById(MerchItemId id, CancellationToken cancellationToken);
}
