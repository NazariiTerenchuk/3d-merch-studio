using Domain.Configurations;

namespace API.DTOs.Configurations;

/// <summary>
/// A placed print with everything the configurator needs to render it (image URL and native size).
/// </summary>
public record ConfigurationPrintDto(
    Guid Id,
    Guid PrintId,
    string? PrintName,
    string? ImageUrl,
    int? WidthPx,
    int? HeightPx,
    string Placement,
    float OffsetX,
    float OffsetY,
    float Scale,
    float Rotation,
    int ZIndex)
{
    public static ConfigurationPrintDto FromDomainModel(ConfigurationPrint configurationPrint,
        Func<string, string> getFileUrl)
        => new(
            configurationPrint.Id.Value,
            configurationPrint.PrintId.Value,
            configurationPrint.Print?.Name,
            configurationPrint.Print?.ImageFilePath != null
                ? getFileUrl(configurationPrint.Print.ImageFilePath)
                : null,
            configurationPrint.Print?.WidthPx,
            configurationPrint.Print?.HeightPx,
            configurationPrint.Placement.Value,
            configurationPrint.OffsetX,
            configurationPrint.OffsetY,
            configurationPrint.Scale,
            configurationPrint.Rotation,
            configurationPrint.ZIndex);
}
