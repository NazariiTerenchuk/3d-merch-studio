using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.Configurations.Exceptions;
using Domain.Common;
using Domain.Configurations;
using Domain.MerchItems;
using MediatR;

namespace Application.Configurations.Commands;

public record CreateSavedConfigurationCommand : IRequest<Result<SavedConfiguration, SavedConfigurationException>>
{
    public required string Name { get; init; }
    public required Guid MerchItemId { get; init; }
    public required string BaseColor { get; init; }
    public required List<ConfigurationPrintInput> Prints { get; init; }
}

public class CreateSavedConfigurationCommandHandler(
    ISavedConfigurationRepository configurationRepository,
    IMerchItemRepository merchItemRepository,
    ConfigurationPrintsBuilder printsBuilder)
    : IRequestHandler<CreateSavedConfigurationCommand, Result<SavedConfiguration, SavedConfigurationException>>
{
    public async Task<Result<SavedConfiguration, SavedConfigurationException>> Handle(
        CreateSavedConfigurationCommand request, CancellationToken cancellationToken)
    {
        var id = SavedConfigurationId.New();
        var merchItemId = new MerchItemId(request.MerchItemId);
        var existingMerchItem = await merchItemRepository.GetById(merchItemId, cancellationToken);

        return await existingMerchItem
            .Filter(m => m.IsActive)
            .Match(
                async merchItem => await CreateEntity(id, merchItem, request, cancellationToken),
                () => Task.FromResult<Result<SavedConfiguration, SavedConfigurationException>>(
                    new ConfigurationMerchItemNotAvailableException(id, merchItemId)));
    }

    private async Task<Result<SavedConfiguration, SavedConfigurationException>> CreateEntity(
        SavedConfigurationId id, MerchItem merchItem, CreateSavedConfigurationCommand request,
        CancellationToken cancellationToken)
    {
        if (merchItem.ModelFilePath == null)
            return new ConfigurationMerchItemHasNoModelException(id, merchItem.Id);

        var baseColor = HexColor.Normalize(request.BaseColor);
        if (!merchItem.AvailableColors.Contains(baseColor))
            return new ConfigurationBaseColorNotAvailableException(id, baseColor);

        var printsResult = await printsBuilder.Build(id, request.Prints, cancellationToken);

        return await printsResult.Match<Task<Result<SavedConfiguration, SavedConfigurationException>>>(
            async prints =>
            {
                try
                {
                    var configuration = SavedConfiguration.New(id, request.Name.Trim(), merchItem.Id, baseColor);
                    configuration.ReplacePrints(prints);

                    return await configurationRepository.Add(configuration, cancellationToken);
                }
                catch (Exception exception)
                {
                    return new SavedConfigurationUnknownException(id, exception);
                }
            },
            error => Task.FromResult<Result<SavedConfiguration, SavedConfigurationException>>(error));
    }
}
