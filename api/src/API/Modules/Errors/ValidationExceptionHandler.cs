using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;

namespace API.Modules.Errors;

/// <summary>
/// Turns ValidationException thrown by the MediatR ValidationBehaviour into 400 instead of 500.
/// </summary>
public class ValidationExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not ValidationException validationException)
            return false;

        httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        await httpContext.Response.WriteAsJsonAsync(validationException.Message, cancellationToken);
        return true;
    }
}
