namespace API.DTOs.MerchItems;

public record CreateMerchItemDto(
    string Name,
    string? Description,
    string Category,
    List<string> AvailableColors);
