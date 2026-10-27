using Application.Common;
using Microsoft.AspNetCore.Http;

namespace Application.Services.FileStorage;

public interface IFileService
{
    /// <summary>
    /// Validates the file against the rules for <paramref name="kind"/>, uploads it and,
    /// on success, deletes <paramref name="oldFileKey"/> (if any).
    /// </summary>
    Task<Result<StoredFile, FileStorageException>> SaveAsync(FileKind kind, IFormFile file, string? oldFileKey,
        CancellationToken cancellationToken);

    Task<bool> DeleteAsync(string fileKey, CancellationToken cancellationToken);

    string GetPublicUrl(string fileKey);
}
