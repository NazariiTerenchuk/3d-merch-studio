using Application.Configurations.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace API.Modules.Errors;

public static class SavedConfigurationErrorHandler
{
    public static ObjectResult ToObjectResult(this SavedConfigurationException exception)
    {
        return new ObjectResult(exception.Message)
        {
            StatusCode = exception switch
            {
                SavedConfigurationNotFoundException
                    => StatusCodes.Status404NotFound,

                ConfigurationMerchItemNotAvailableException
                    or ConfigurationMerchItemHasNoModelException
                    or ConfigurationBaseColorNotAvailableException
                    or ConfigurationPrintsNotAvailableException
                    => StatusCodes.Status400BadRequest,

                SavedConfigurationUnknownException
                    => StatusCodes.Status500InternalServerError,

                _ => StatusCodes.Status500InternalServerError
            }
        };
    }
}
