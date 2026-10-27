using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.Configurations.Exceptions;
using Domain.Configurations;
using Domain.Prints;

namespace Application.Configurations.Commands;

/// <summary>
/// Shared by create and update: checks that every referenced print exists, is active and has an image,
/// then builds the ConfigurationPrint entities.
/// </summary>
public class ConfigurationPrintsBuilder(IPrintRepository printRepository)
{
    public async Task<Result<List<ConfigurationPrint>, SavedConfigurationException>> Build(
        SavedConfigurationId configurationId,
        IReadOnlyList<ConfigurationPrintInput> inputs,
        CancellationToken cancellationToken)
    {
        var requestedIds = inputs.Select(p => new PrintId(p.PrintId)).Distinct().ToList();
        var prints = await printRepository.GetByIds(requestedIds, cancellationToken);

        var usable = prints
            .Where(p => p.IsActive && p.ImageFilePath != null)
            .Select(p => p.Id)
            .ToHashSet();

        var unavailable = requestedIds.Where(id => !usable.Contains(id)).ToList();
        if (unavailable.Count > 0)
            return new ConfigurationPrintsNotAvailableException(configurationId, unavailable);

        return inputs
            .Select(p => ConfigurationPrint.New(
                ConfigurationPrintId.New(),
                configurationId,
                new PrintId(p.PrintId),
                PrintPlacement.From(p.Placement),
                p.OffsetX,
                p.OffsetY,
                p.Scale,
                p.Rotation,
                p.ZIndex))
            .ToList();
    }
}
