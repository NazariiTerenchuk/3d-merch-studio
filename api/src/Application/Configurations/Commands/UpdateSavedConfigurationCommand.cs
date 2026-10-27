using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.Configurations.Exceptions;
using Domain.Common;
using Domain.Configurations;
using MediatR;

namespace Application.Configurations.Commands;

/// <summary>
/// Updates name and color and replaces the whole list of placed prints. The merch item cannot change.
/// </summary>
public record UpdateSavedConfigurationCommand : IRequest<Result<SavedConfiguration, SavedConfigurationException>>
{
    public required Guid ConfigurationId { get; init; }
    public required string Name { get; init; }
    public required string BaseColor { get; init; }
    public required List<ConfigurationPrintInput> Prints { get; init; }
}

public class UpdateSavedConfigurationCommandHandler(
    ISavedConfigurationRepository configurationRepository,
    IMerchItemRepository merchItemRepository,
    ConfigurationPrintsBuilder printsBuilder)
    : IRequestHandler<UpdateSavedConfigurationCommand, Result<SavedConfiguration, SavedConfigurationException>>
{
    public async Task<Result<SavedConfiguration, SavedConfigurationException>> Handle(
        UpdateSavedConfigurationCommand request, CancellationToken cancellationToken)
    {
        var id = new SavedConfigurationId(request.ConfigurationId);
        var existingConfiguration = await configurationRepository.GetById(id, cancellationToken);

        return await existingConfiguration.Match(
            async configuration => await UpdateEntity(configuration, request, cancellationToken),
            () => Task.FromResult<Result<SavedConfiguration, SavedConfigurationException>>(
                new SavedConfigurationNotFoundException(id)));
    }

    private async Task<Result<SavedConfiguration, SavedConfigurationException>> UpdateEntity(
        SavedConfiguration configuration, UpdateSavedConfigurationCommand request,
        CancellationToken cancellationToken)
    {
        var merchItem = await merchItemRepository.GetById(configuration.MerchItemId, cancellationToken);
        var availableColors = merchItem.Match(m => m.AvailableColors, () => new List<string>());

        var baseColor = HexColor.Normalize(request.BaseColor);
        if (!availableColors.Contains(baseColor))
            return new ConfigurationBaseColorNotAvailableException(configuration.Id, baseColor);

        var printsResult = await printsBuilder.Build(configuration.Id, request.Prints, cancellationToken);

        return await printsResult.Match<Task<Result<SavedConfiguration, SavedConfigurationException>>>(
            async prints =>
            {
                try
                {
                    configuration.Update(request.Name.Trim(), baseColor);
                    configuration.ReplacePrints(prints);

                    return await configurationRepository.Update(configuration, cancellationToken);
                }
                catch (Exception exception)
                {
                    return new SavedConfigurationUnknownException(configuration.Id, exception);
                }
            },
            error => Task.FromResult<Result<SavedConfiguration, SavedConfigurationException>>(error));
    }
}
