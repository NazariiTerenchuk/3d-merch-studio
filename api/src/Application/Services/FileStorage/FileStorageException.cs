namespace Application.Services.FileStorage;

public abstract class FileStorageException(string message, Exception? innerException = null)
    : Exception(message, innerException);

public class EmptyFileException()
    : FileStorageException("File is empty.");

public class FileTooLargeException(long maxSizeBytes)
    : FileStorageException($"File exceeds the maximum allowed size of {maxSizeBytes / (1024 * 1024)} MB.");

public class UnsupportedFileExtensionException(string extension, IEnumerable<string> allowed)
    : FileStorageException($"File extension '{extension}' is not allowed. Allowed: {string.Join(", ", allowed)}.");

public class InvalidFileContentException(string extension)
    : FileStorageException($"File content does not match the '{extension}' format.");

public class StorageNotConfiguredException()
    : FileStorageException("File storage is not configured. Fill the BackblazeB2 section in appsettings.");

public class FileUploadFailedException(Exception innerException)
    : FileStorageException("Failed to upload file to storage.", innerException);
