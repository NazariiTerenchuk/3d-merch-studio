using Application.Services.FileStorage;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Infrastructure.Storage;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class ConfigureInfrastructure
{
    public static void AddInfrastructure(this IServiceCollection services, WebApplicationBuilder builder)
    {
        services.AddPersistence(builder);
        services.AddStorageServices(builder);
        services.AddScoped<IFileService, FileService>();
    }
}
