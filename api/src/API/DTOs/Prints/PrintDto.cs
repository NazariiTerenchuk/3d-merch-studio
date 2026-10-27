using Domain.Prints;

namespace API.DTOs.Prints;

public record PrintDto(
    Guid Id,
    string Name,
    string? Description,
    string Category,
    string? ImageUrl,
    int? WidthPx,
    int? HeightPx,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt)
{
    public static PrintDto FromDomainModel(Print print, Func<string, string> getFileUrl)
        => new(
            print.Id.Value,
            print.Name,
            print.Description,
            print.Category.Value,
            print.ImageFilePath != null ? getFileUrl(print.ImageFilePath) : null,
            print.WidthPx,
            print.HeightPx,
            print.IsActive,
            print.CreatedAt,
            print.UpdatedAt);
}
