using Domain.Configurations;
using Optional;

namespace Application.Common.Interfaces.Repositories;

public interface ISavedConfigurationRepository
{
    /// <summary>Tracked entity with its prints loaded.</summary>
    Task<Option<SavedConfiguration>> GetById(SavedConfigurationId id, CancellationToken cancellationToken);
    Task<SavedConfiguration> Add(SavedConfiguration configuration, CancellationToken cancellationToken);
    Task<SavedConfiguration> Update(SavedConfiguration configuration, CancellationToken cancellationToken);
    Task<SavedConfiguration> Delete(SavedConfiguration configuration, CancellationToken cancellationToken);
}
