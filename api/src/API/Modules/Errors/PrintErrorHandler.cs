using Application.Prints.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace API.Modules.Errors;

public static class PrintErrorHandler
{
    public static ObjectResult ToObjectResult(this PrintException exception)
    {
        return new ObjectResult(exception.Message)
        {
            StatusCode = exception switch
            {
                PrintNotFoundException
                    => StatusCodes.Status404NotFound,

                PrintHasConfigurationsException
                    => StatusCodes.Status409Conflict,

                PrintFileException fileException
                    => fileException.FileError.ToStatusCode(),

                PrintUnknownException
                    => StatusCodes.Status500InternalServerError,

                _ => StatusCodes.Status500InternalServerError
            }
        };
    }
}
