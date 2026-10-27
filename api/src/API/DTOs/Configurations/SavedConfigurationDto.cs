using API.DTOs.MerchItems;
using Domain.Configurations;

namespace API.DTOs.Configurations;

public record SavedConfigurationDto(
    Guid Id,
    string Name,
    string ShareCode,
    string BaseColor,
    Guid MerchItemId,
    MerchItemDto? MerchItem,
    List<ConfigurationPrintDto> Prints,
    DateTime CreatedAt,
    DateTime UpdatedAt)
{
    public static SavedConfigurationDto FromDomainModel(SavedConfiguration configuration,
        Func<string, string> getFileUrl)
        => new(
            configuration.Id.Value,
            configuration.Name,
            configuration.ShareCode,
            configuration.BaseColor,
            configuration.MerchItemId.Value,
            configuration.MerchItem != null ? MerchItemDto.FromDomainModel(configuration.MerchItem, getFileUrl) : null,
            configuration.Prints
                .OrderBy(p => p.ZIndex)
                .Select(p => ConfigurationPrintDto.FromDomainModel(p, getFileUrl))
                .ToList(),
            configuration.CreatedAt,
            configuration.UpdatedAt);
}
