using Amazon.S3;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Infrastructure.Storage;

public static class ConfigureStorage
{
    public static void AddStorageServices(this IServiceCollection services, WebApplicationBuilder builder)
    {
        services.Configure<BackblazeB2Settings>(builder.Configuration.GetSection(BackblazeB2Settings.SectionName));
        services.Configure<FileUploadSettings>(builder.Configuration.GetSection(FileUploadSettings.SectionName));

        // Created on first use, so the API starts even when B2 keys are not filled in yet.
        services.AddSingleton(provider => new Lazy<IAmazonS3>(() =>
        {
            var b2Settings = provider.GetRequiredService<IOptions<BackblazeB2Settings>>().Value;

            var config = new AmazonS3Config
            {
                ServiceURL = $"https://{b2Settings.Endpoint}",
                ForcePathStyle = true
            };

            return new AmazonS3Client(b2Settings.KeyId, b2Settings.ApplicationKey, config);
        }));

        services.AddScoped<IStorageService, BackblazeB2StorageService>();
    }
}
