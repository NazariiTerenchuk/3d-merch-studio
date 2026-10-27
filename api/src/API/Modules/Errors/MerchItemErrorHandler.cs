using Application.MerchItems.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace API.Modules.Errors;

public static class MerchItemErrorHandler
{
    public static ObjectResult ToObjectResult(this MerchItemException exception)
    {
        return new ObjectResult(exception.Message)
        {
            StatusCode = exception switch
            {
                MerchItemNotFoundException
                    => StatusCodes.Status404NotFound,

                MerchItemHasConfigurationsException
                    => StatusCodes.Status409Conflict,

                MerchItemFileException fileException
                    => fileException.FileError.ToStatusCode(),

                MerchItemUnknownException
                    => StatusCodes.Status500InternalServerError,

                _ => StatusCodes.Status500InternalServerError
            }
        };
    }
}
