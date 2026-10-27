using Application.Services.FileStorage;
using Domain.Prints;

namespace Application.Prints.Exceptions;

public abstract class PrintException(PrintId id, string message, Exception? innerException = null)
    : Exception(message, innerException)
{
    public PrintId PrintId { get; } = id;
}

public class PrintNotFoundException(PrintId id)
    : PrintException(id, $"Print with ID {id} not found");

public class PrintHasConfigurationsException(PrintId id)
    : PrintException(id, $"Print with ID {id} cannot be deleted because it is used in saved configurations.");

public class PrintUnknownException(PrintId id, Exception innerException)
    : PrintException(id, $"Unknown exception for the print with ID {id}", innerException);

public class PrintFileException(PrintId id, FileStorageException innerException)
    : PrintException(id, innerException.Message, innerException)
{
    public FileStorageException FileError { get; } = innerException;
}
