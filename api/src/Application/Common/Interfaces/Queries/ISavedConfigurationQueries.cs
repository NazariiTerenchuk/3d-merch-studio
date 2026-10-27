using Domain.Configurations;
using Domain.MerchItems;
using Optional;

namespace Application.Common.Interfaces.Queries;

/// <summary>
/// All queries include the merch item and the placed prints with their Print entities.
/// </summary>
public interface ISavedConfigurationQueries
{
    Task<IReadOnlyList<SavedConfiguration>> GetAll(CancellationToken cancellationToken);
    Task<IReadOnlyList<SavedConfiguration>> GetByMerchItem(MerchItemId merchItemId,
        CancellationToken cancellationToken);
    Task<Option<SavedConfiguration>> GetById(SavedConfigurationId id, CancellationToken cancellationToken);
    Task<Option<SavedConfiguration>> GetByShareCode(string shareCode, CancellationToken cancellationToken);
}
