using Domain.Prints;

namespace Domain.Configurations;

/// <summary>
/// A print placed on a saved configuration. Offsets are normalized (-1..1) within
/// the placement zone so they stay independent of the 3D renderer.
/// </summary>
public class ConfigurationPrint
{
    public const float MinOffset = -1f;
    public const float MaxOffset = 1f;
    public const float MinScale = 0.1f;
    public const float MaxScale = 3f;

    public ConfigurationPrintId Id { get; }
    public SavedConfigurationId ConfigurationId { get; }
    public SavedConfiguration? Configuration { get; private set; }
    public PrintId PrintId { get; private set; }
    public Print? Print { get; private set; }
    public PrintPlacement Placement { get; private set; }
    public float OffsetX { get; private set; }
    public float OffsetY { get; private set; }
    public float Scale { get; private set; }
    public float Rotation { get; private set; }
    public int ZIndex { get; private set; }

    private ConfigurationPrint(ConfigurationPrintId id, SavedConfigurationId configurationId, PrintId printId,
        PrintPlacement placement, float offsetX, float offsetY, float scale, float rotation, int zIndex)
    {
        Id = id;
        ConfigurationId = configurationId;
        PrintId = printId;
        Placement = placement;
        OffsetX = offsetX;
        OffsetY = offsetY;
        Scale = scale;
        Rotation = rotation;
        ZIndex = zIndex;
    }

    public static ConfigurationPrint New(ConfigurationPrintId id, SavedConfigurationId configurationId,
        PrintId printId, PrintPlacement placement, float offsetX, float offsetY, float scale, float rotation,
        int zIndex)
        => new(id, configurationId, printId, placement, offsetX, offsetY, scale, rotation, zIndex);
}
