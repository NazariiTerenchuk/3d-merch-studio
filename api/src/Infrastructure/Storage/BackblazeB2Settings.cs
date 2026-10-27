namespace Infrastructure.Storage;

public class BackblazeB2Settings
{
    public const string SectionName = "BackblazeB2";

    public string KeyId { get; set; } = string.Empty;
    public string ApplicationKey { get; set; } = string.Empty;
    public string BucketName { get; set; } = string.Empty;
    public string BucketId { get; set; } = string.Empty;
    public string Endpoint { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(KeyId)
        && !string.IsNullOrWhiteSpace(ApplicationKey)
        && !string.IsNullOrWhiteSpace(BucketName)
        && !string.IsNullOrWhiteSpace(Endpoint);

    public string GetPublicUrl(string key)
        => $"https://{BucketName}.{Endpoint}/{key}";
}
