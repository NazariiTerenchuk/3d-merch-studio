using Application.Services.FileStorage;

namespace API.Modules.Errors;

public static class FileStorageErrorHandler
{
    public static int ToStatusCode(this FileStorageException exception)
        => exception switch
        {
            EmptyFileException
                or FileTooLargeException
                or UnsupportedFileExtensionException
                or InvalidFileContentException
                => StatusCodes.Status400BadRequest,

            StorageNotConfiguredException
                => StatusCodes.Status503ServiceUnavailable,

            FileUploadFailedException
                => StatusCodes.Status502BadGateway,

            _ => StatusCodes.Status500InternalServerError
        };
}
