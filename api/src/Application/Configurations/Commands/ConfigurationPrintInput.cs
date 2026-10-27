namespace Application.Configurations.Commands;

public record ConfigurationPrintInput(
    Guid PrintId,
    string Placement,
    float OffsetX,
    float OffsetY,
    float Scale,
    float Rotation,
    int ZIndex);
