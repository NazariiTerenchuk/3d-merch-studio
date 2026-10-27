using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Prints;
using Microsoft.EntityFrameworkCore;
using Optional;

namespace Infrastructure.Persistence.Repositories;

public class PrintRepository(ApplicationDbContext context) : IPrintQueries, IPrintRepository
{
    public async Task<IReadOnlyList<Print>> GetAll(PrintCategory? category, bool onlyActive,
        CancellationToken cancellationToken)
    {
        var query = context.Prints.AsNoTracking();

        if (category != null)
            query = query.Where(x => x.Category == category);

        if (onlyActive)
            query = query.Where(x => x.IsActive);

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    async Task<Option<Print>> IPrintQueries.GetById(PrintId id, CancellationToken cancellationToken)
    {
        var entity = await context.Prints
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return entity == null ? Option.None<Print>() : Option.Some(entity);
    }

    public async Task<Option<Print>> GetById(PrintId id, CancellationToken cancellationToken)
    {
        var entity = await context.Prints
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return entity == null ? Option.None<Print>() : Option.Some(entity);
    }

    public async Task<IReadOnlyList<Print>> GetByIds(IEnumerable<PrintId> ids, CancellationToken cancellationToken)
    {
        var idList = ids.Distinct().ToList();

        return await context.Prints
            .Where(x => idList.Contains(x.Id))
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IsUsedInConfigurations(PrintId id, CancellationToken cancellationToken)
    {
        return await context.ConfigurationPrints.AnyAsync(x => x.PrintId == id, cancellationToken);
    }

    public async Task<Print> Add(Print print, CancellationToken cancellationToken)
    {
        await context.Prints.AddAsync(print, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return print;
    }

    public async Task<Print> Update(Print print, CancellationToken cancellationToken)
    {
        context.Prints.Update(print);
        await context.SaveChangesAsync(cancellationToken);
        return print;
    }

    public async Task<Print> Delete(Print print, CancellationToken cancellationToken)
    {
        context.Prints.Remove(print);
        await context.SaveChangesAsync(cancellationToken);
        return print;
    }
}
