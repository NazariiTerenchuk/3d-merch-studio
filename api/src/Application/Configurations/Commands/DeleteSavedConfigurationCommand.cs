using Application.Common;
using Application.Common.Interfaces.Repositories;
using Application.Configurations.Exceptions;
using Domain.Configurations;
using MediatR;

namespace Application.Configurations.Commands;

public record DeleteSavedConfigurationCommand : IRequest<Result<SavedConfiguration, SavedConfigurationException>>
{
    public required Guid ConfigurationId { get; init; }
}

public class DeleteSavedConfigurationCommandHandler(ISavedConfigurationRepository configurationRepository)
    : IRequestHandler<DeleteSavedConfigurationCommand, Result<SavedConfiguration, SavedConfigurationException>>
{
    public async Task<Result<SavedConfiguration, SavedConfigurationException>> Handle(
        DeleteSavedConfigurationCommand request, CancellationToken cancellationToken)
    {
        var id = new SavedConfigurationId(request.ConfigurationId);
        var existingConfiguration = await configurationRepository.GetById(id, cancellationToken);

        return await existingConfiguration.Match(
            async configuration => await DeleteEntity(configuration, cancellationToken),
            () => Task.FromResult<Result<SavedConfiguration, SavedConfigurationException>>(
                new SavedConfigurationNotFoundException(id)));
    }

    private async Task<Result<SavedConfiguration, SavedConfigurationException>> DeleteEntity(
        SavedConfiguration configuration, CancellationToken cancellationToken)
    {
        try
        {
            return await configurationRepository.Delete(configuration, cancellationToken);
        }
        catch (Exception exception)
        {
            return new SavedConfigurationUnknownException(configuration.Id, exception);
        }
    }
}
