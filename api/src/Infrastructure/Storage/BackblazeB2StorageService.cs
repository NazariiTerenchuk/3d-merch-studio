using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Options;

namespace Infrastructure.Storage;

public class BackblazeB2StorageService(Lazy<IAmazonS3> s3Client, IOptions<BackblazeB2Settings> settings)
    : IStorageService
{
    // Files above this size are sent as S3 multipart upload (B2 minimum part size is 5 MB).
    private const long MultipartThresholdBytes = 16 * 1024 * 1024;
    private const long PartSizeBytes = 8 * 1024 * 1024;

    private readonly BackblazeB2Settings _settings = settings.Value;

    public bool IsConfigured => _settings.IsConfigured;

    public async Task UploadAsync(string key, Stream content, string contentType,
        CancellationToken cancellationToken = default)
    {
        var request = new TransferUtilityUploadRequest
        {
            BucketName = _settings.BucketName,
            Key = key,
            InputStream = content,
            ContentType = contentType,
            PartSize = PartSizeBytes
        };

        var transferUtility = new TransferUtility(s3Client.Value, new TransferUtilityConfig
        {
            MinSizeBeforePartUpload = MultipartThresholdBytes
        });

        await transferUtility.UploadAsync(request, cancellationToken);
    }

    public async Task DeleteAsync(string key, CancellationToken cancellationToken = default)
    {
        await s3Client.Value.DeleteObjectAsync(new DeleteObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = key
        }, cancellationToken);
    }

    public string GetPublicUrl(string key)
        => _settings.GetPublicUrl(key);
}
