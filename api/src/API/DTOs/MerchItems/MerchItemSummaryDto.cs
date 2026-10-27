using Domain.MerchItems;

namespace API.DTOs.MerchItems;

/// <summary>
/// Lightweight card for the catalog.
/// </summary>
public record MerchItemSummaryDto(
    Guid Id,
    string Name,
    string Category,
    List<string> AvailableColors,
    string? PreviewUrl,
    bool HasModel,
    bool IsActive)
{
    public static MerchItemSummaryDto FromDomainModel(MerchItem merchItem, Func<string, string> getFileUrl)
        => new(
            merchItem.Id.Value,
            merchItem.Name,
            merchItem.Category.Value,
            merchItem.AvailableColors,
            merchItem.PreviewImagePath != null ? getFileUrl(merchItem.PreviewImagePath) : null,
            merchItem.ModelFilePath != null,
            merchItem.IsActive);
}
