namespace Infrastructure.Storage;

public class FileUploadSettings
{
    public const string SectionName = "FileUpload";

    public int MaxModelSizeMb { get; set; } = 50;
    public int MaxPrintSizeMb { get; set; } = 10;
    public int MaxPreviewSizeMb { get; set; } = 5;
}
