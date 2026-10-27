using Application.Services.FileStorage;
using Domain.MerchItems;

namespace Application.MerchItems.Exceptions;

public abstract class MerchItemException(MerchItemId id, string message, Exception? innerException = null)
    : Exception(message, innerException)
{
    public MerchItemId MerchItemId { get; } = id;
}

public class MerchItemNotFoundException(MerchItemId id)
    : MerchItemException(id, $"Merch item with ID {id} not found");

public class MerchItemHasConfigurationsException(MerchItemId id)
    : MerchItemException(id, $"Merch item with ID {id} cannot be deleted because it is used in saved configurations.");

public class MerchItemUnknownException(MerchItemId id, Exception innerException)
    : MerchItemException(id, $"Unknown exception for the merch item with ID {id}", innerException);

/// <summary>
/// Wraps a file storage error that happened while uploading a file for the merch item.
/// </summary>
public class MerchItemFileException(MerchItemId id, FileStorageException innerException)
    : MerchItemException(id, innerException.Message, innerException)
{
    public FileStorageException FileError { get; } = innerException;
}
