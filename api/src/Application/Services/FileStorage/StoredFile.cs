namespace Application.Services.FileStorage;

/// <summary>
/// Result of a successful upload. WidthPx/HeightPx are filled for PNG files only.
/// </summary>
public record StoredFile(string Key, string ContentType, long SizeBytes, int? WidthPx, int? HeightPx);
