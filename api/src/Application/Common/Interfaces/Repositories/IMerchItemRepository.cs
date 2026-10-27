using Domain.MerchItems;
using Optional;

namespace Application.Common.Interfaces.Repositories;

public interface IMerchItemRepository
{
    Task<Option<MerchItem>> GetById(MerchItemId id, CancellationToken cancellationToken);
    Task<bool> IsUsedInConfigurations(MerchItemId id, CancellationToken cancellationToken);
    Task<MerchItem> Add(MerchItem merchItem, CancellationToken cancellationToken);
    Task<MerchItem> Update(MerchItem merchItem, CancellationToken cancellationToken);
    Task<MerchItem> Delete(MerchItem merchItem, CancellationToken cancellationToken);
}
