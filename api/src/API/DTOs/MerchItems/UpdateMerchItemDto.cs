namespace API.DTOs.MerchItems;

public record UpdateMerchItemDto(
    string Name,
    string? Description,
    string Category,
    List<string> AvailableColors,
    bool IsActive);
