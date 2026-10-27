using Application.Common;
using Application.Services.FileStorage;
using Infrastructure.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services;

public class FileService(
    IStorageService storageService,
    IOptions<FileUploadSettings> uploadSettings,
    ILogger<FileService> logger) : IFileService
{
    public async Task<Result<StoredFile, FileStorageException>> SaveAsync(FileKind kind, IFormFile file,
        string? oldFileKey, CancellationToken cancellationToken)
    {
        var rule = FileRules.For(kind, uploadSettings.Value);

        if (file.Length == 0)
            return new EmptyFileException();

        if (file.Length > rule.MaxSizeBytes)
            return new FileTooLargeException(rule.MaxSizeBytes);

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var format = rule.Formats.FirstOrDefault(f => f.Extension == extension);
        if (format is null)
            return new UnsupportedFileExtensionException(extension, rule.AllowedExtensions);

        var header = await ReadHeaderAsync(file, cancellationToken);
        if (!FileRules.MatchesSignature(format, header))
            return new InvalidFileContentException(extension);

        if (!storageService.IsConfigured)
            return new StorageNotConfiguredException();

        var pngSize = format.ContentType == "image/png" ? FileRules.ReadPngSize(header) : null;
        var key = $"{StoragePaths.For(kind)}/{Guid.NewGuid()}{format.Extension}";

        try
        {
            await using var stream = file.OpenReadStream();
            await storageService.UploadAsync(key, stream, format.ContentType, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to upload {Kind} file to storage with key {Key}", kind, key);
            return new FileUploadFailedException(ex);
        }

        if (!string.IsNullOrEmpty(oldFileKey))
        {
            await DeleteAsync(oldFileKey, cancellationToken);
        }

        return new StoredFile(key, format.ContentType, file.Length, pngSize?.Width, pngSize?.Height);
    }

    public async Task<bool> DeleteAsync(string fileKey, CancellationToken cancellationToken)
    {
        if (!storageService.IsConfigured)
            return false;

        try
        {
            await storageService.DeleteAsync(fileKey, cancellationToken);
            return true;
        }
        catch (Exception ex)
        {
            // Orphaned blobs are not critical, so deletion failures are logged and swallowed.
            logger.LogWarning(ex, "Failed to delete file {Key} from storage", fileKey);
            return false;
        }
    }

    public string GetPublicUrl(string fileKey)
        => storageService.GetPublicUrl(fileKey);

    private static async Task<byte[]> ReadHeaderAsync(IFormFile file, CancellationToken cancellationToken)
    {
        var buffer = new byte[FileRules.HeaderLength];
        await using var stream = file.OpenReadStream();
        var read = await stream.ReadAtLeastAsync(buffer, buffer.Length, throwOnEndOfStream: false, cancellationToken);
        return buffer[..read];
    }
}
