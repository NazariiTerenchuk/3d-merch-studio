using Domain.MerchItems;

namespace API.DTOs.MerchItems;

public record MerchItemDto(
    Guid Id,
    string Name,
    string? Description,
    string Category,
    List<string> AvailableColors,
    string? ModelUrl,
    string? PreviewUrl,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt)
{
    public static MerchItemDto FromDomainModel(MerchItem merchItem, Func<string, string> getFileUrl)
        => new(
            merchItem.Id.Value,
            merchItem.Name,
            merchItem.Description,
            merchItem.Category.Value,
            merchItem.AvailableColors,
            merchItem.ModelFilePath != null ? getFileUrl(merchItem.ModelFilePath) : null,
            merchItem.PreviewImagePath != null ? getFileUrl(merchItem.PreviewImagePath) : null,
            merchItem.IsActive,
            merchItem.CreatedAt,
            merchItem.UpdatedAt);
}
