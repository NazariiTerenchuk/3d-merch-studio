using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Configurations;
using Domain.MerchItems;
using Microsoft.EntityFrameworkCore;
using Optional;

namespace Infrastructure.Persistence.Repositories;

public class SavedConfigurationRepository(ApplicationDbContext context)
    : ISavedConfigurationQueries, ISavedConfigurationRepository
{
    private IQueryable<SavedConfiguration> QueryWithDetails()
        => context.SavedConfigurations
            .Include(x => x.MerchItem)
            .Include(x => x.Prints.OrderBy(p => p.ZIndex)).ThenInclude(p => p.Print)
            .AsSplitQuery()
            .AsNoTracking();

    public async Task<IReadOnlyList<SavedConfiguration>> GetAll(CancellationToken cancellationToken)
    {
        return await QueryWithDetails()
            .OrderByDescending(x => x.UpdatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<SavedConfiguration>> GetByMerchItem(MerchItemId merchItemId,
        CancellationToken cancellationToken)
    {
        return await QueryWithDetails()
            .Where(x => x.MerchItemId == merchItemId)
            .OrderByDescending(x => x.UpdatedAt)
            .ToListAsync(cancellationToken);
    }

    async Task<Option<SavedConfiguration>> ISavedConfigurationQueries.GetById(SavedConfigurationId id,
        CancellationToken cancellationToken)
    {
        var entity = await QueryWithDetails().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        return entity == null ? Option.None<SavedConfiguration>() : Option.Some(entity);
    }

    public async Task<Option<SavedConfiguration>> GetByShareCode(string shareCode,
        CancellationToken cancellationToken)
    {
        var entity = await QueryWithDetails().FirstOrDefaultAsync(x => x.ShareCode == shareCode, cancellationToken);
        return entity == null ? Option.None<SavedConfiguration>() : Option.Some(entity);
    }

    public async Task<Option<SavedConfiguration>> GetById(SavedConfigurationId id,
        CancellationToken cancellationToken)
    {
        var entity = await context.SavedConfigurations
            .Include(x => x.Prints)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return entity == null ? Option.None<SavedConfiguration>() : Option.Some(entity);
    }

    public async Task<SavedConfiguration> Add(SavedConfiguration configuration, CancellationToken cancellationToken)
    {
        await context.SavedConfigurations.AddAsync(configuration, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return configuration;
    }

    public async Task<SavedConfiguration> Update(SavedConfiguration configuration,
        CancellationToken cancellationToken)
    {
        // The entity is tracked (loaded via GetById). Calling context.Update() here would mark the newly
        // added ConfigurationPrint rows as Modified instead of Added, so change detection is used instead.
        await context.SaveChangesAsync(cancellationToken);
        return configuration;
    }

    public async Task<SavedConfiguration> Delete(SavedConfiguration configuration,
        CancellationToken cancellationToken)
    {
        context.SavedConfigurations.Remove(configuration);
        await context.SaveChangesAsync(cancellationToken);
        return configuration;
    }
}
