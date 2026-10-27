using Domain.Configurations;
using Domain.MerchItems;
using Domain.Prints;

namespace Application.Configurations.Exceptions;

public abstract class SavedConfigurationException(SavedConfigurationId id, string message,
    Exception? innerException = null) : Exception(message, innerException)
{
    public SavedConfigurationId ConfigurationId { get; } = id;
}

public class SavedConfigurationNotFoundException(SavedConfigurationId id)
    : SavedConfigurationException(id, $"Saved configuration with ID {id} not found");

public class ConfigurationMerchItemNotAvailableException(SavedConfigurationId id, MerchItemId merchItemId)
    : SavedConfigurationException(id, $"Merch item with ID {merchItemId} does not exist or is not active.");

public class ConfigurationMerchItemHasNoModelException(SavedConfigurationId id, MerchItemId merchItemId)
    : SavedConfigurationException(id, $"Merch item with ID {merchItemId} has no 3D model uploaded yet.");

public class ConfigurationBaseColorNotAvailableException(SavedConfigurationId id, string color)
    : SavedConfigurationException(id, $"Color {color} is not available for this merch item.");

public class ConfigurationPrintsNotAvailableException(SavedConfigurationId id, IEnumerable<PrintId> printIds)
    : SavedConfigurationException(id,
        $"Prints do not exist, are not active or have no image: {string.Join(", ", printIds)}.");

public class SavedConfigurationUnknownException(SavedConfigurationId id, Exception innerException)
    : SavedConfigurationException(id, $"Unknown exception for the saved configuration with ID {id}",
        innerException);
