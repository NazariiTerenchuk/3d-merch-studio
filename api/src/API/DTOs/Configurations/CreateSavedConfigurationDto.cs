namespace API.DTOs.Configurations;

public record CreateSavedConfigurationDto(
    string Name,
    Guid MerchItemId,
    string BaseColor,
    List<ConfigurationPrintInputDto> Prints);

public record UpdateSavedConfigurationDto(
    string Name,
    string BaseColor,
    List<ConfigurationPrintInputDto> Prints);

public record ConfigurationPrintInputDto(
    Guid PrintId,
    string Placement,
    float OffsetX,
    float OffsetY,
    float Scale,
    float Rotation,
    int ZIndex);
