using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.MerchItems;
using Microsoft.EntityFrameworkCore;
using Optional;

namespace Infrastructure.Persistence.Repositories;

public class MerchItemRepository(ApplicationDbContext context) : IMerchItemQueries, IMerchItemRepository
{
    public async Task<IReadOnlyList<MerchItem>> GetAll(MerchCategory? category, bool onlyActive,
        CancellationToken cancellationToken)
    {
        var query = context.MerchItems.AsNoTracking();

        if (category != null)
            query = query.Where(x => x.Category == category);

        if (onlyActive)
            query = query.Where(x => x.IsActive);

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<MerchItem> Items, int TotalCount)> GetPaged(int page, int pageSize,
        CancellationToken cancellationToken)
    {
        var query = context.MerchItems.AsNoTracking();

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    async Task<Option<MerchItem>> IMerchItemQueries.GetById(MerchItemId id, CancellationToken cancellationToken)
    {
        var entity = await context.MerchItems
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return entity == null ? Option.None<MerchItem>() : Option.Some(entity);
    }

    public async Task<Option<MerchItem>> GetById(MerchItemId id, CancellationToken cancellationToken)
    {
        var entity = await context.MerchItems
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return entity == null ? Option.None<MerchItem>() : Option.Some(entity);
    }

    public async Task<bool> IsUsedInConfigurations(MerchItemId id, CancellationToken cancellationToken)
    {
        return await context.SavedConfigurations.AnyAsync(x => x.MerchItemId == id, cancellationToken);
    }

    public async Task<MerchItem> Add(MerchItem merchItem, CancellationToken cancellationToken)
    {
        await context.MerchItems.AddAsync(merchItem, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return merchItem;
    }

    public async Task<MerchItem> Update(MerchItem merchItem, CancellationToken cancellationToken)
    {
        context.MerchItems.Update(merchItem);
        await context.SaveChangesAsync(cancellationToken);
        return merchItem;
    }

    public async Task<MerchItem> Delete(MerchItem merchItem, CancellationToken cancellationToken)
    {
        context.MerchItems.Remove(merchItem);
        await context.SaveChangesAsync(cancellationToken);
        return merchItem;
    }
}
