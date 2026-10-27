namespace Infrastructure.Storage;

/// <summary>
/// Low-level object storage. Throws on failure; validation and error mapping live in FileService.
/// </summary>
public interface IStorageService
{
    bool IsConfigured { get; }
    Task UploadAsync(string key, Stream content, string contentType, CancellationToken cancellationToken = default);
    Task DeleteAsync(string key, CancellationToken cancellationToken = default);
    string GetPublicUrl(string key);
}
