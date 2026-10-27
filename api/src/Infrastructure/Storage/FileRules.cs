using Application.Services.FileStorage;

namespace Infrastructure.Storage;

/// <summary>
/// Magic bytes expected at <see cref="Offset"/> of the file.
/// </summary>
public record FileSignature(int Offset, byte[] Bytes);

/// <summary>
/// Allowed formats for a file kind. The browser often sends .glb as application/octet-stream,
/// so the content type stored in B2 is taken from here, never from the client.
/// </summary>
public record FileFormat(string Extension, string ContentType, IReadOnlyList<FileSignature> Signatures);

public record FileRule(IReadOnlyList<FileFormat> Formats, long MaxSizeBytes)
{
    public IEnumerable<string> AllowedExtensions => Formats.Select(f => f.Extension);
}

public static class FileRules
{
    private static readonly FileFormat Glb = new(".glb", "model/gltf-binary",
        [new FileSignature(0, "glTF"u8.ToArray())]);

    private static readonly FileFormat Png = new(".png", "image/png",
        [new FileSignature(0, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])]);

    private static readonly FileFormat Jpeg = new(".jpg", "image/jpeg",
        [new FileSignature(0, [0xFF, 0xD8, 0xFF])]);

    private static readonly FileFormat JpegLong = Jpeg with { Extension = ".jpeg" };

    private static readonly FileFormat Webp = new(".webp", "image/webp",
        [new FileSignature(0, "RIFF"u8.ToArray()), new FileSignature(8, "WEBP"u8.ToArray())]);

    public static FileRule For(FileKind kind, FileUploadSettings settings) => kind switch
    {
        FileKind.Model3D => new FileRule([Glb], ToBytes(settings.MaxModelSizeMb)),
        FileKind.PrintImage => new FileRule([Png], ToBytes(settings.MaxPrintSizeMb)),
        FileKind.PreviewImage => new FileRule([Png, Jpeg, JpegLong, Webp], ToBytes(settings.MaxPreviewSizeMb)),
        _ => throw new ArgumentOutOfRangeException(nameof(kind), kind, null)
    };

    /// <summary>Number of leading bytes needed to check every signature and read PNG dimensions.</summary>
    public const int HeaderLength = 24;

    public static bool MatchesSignature(FileFormat format, ReadOnlySpan<byte> header)
    {
        foreach (var signature in format.Signatures)
        {
            if (header.Length < signature.Offset + signature.Bytes.Length
                || !header.Slice(signature.Offset, signature.Bytes.Length).SequenceEqual(signature.Bytes))
                return false;
        }

        return true;
    }

    /// <summary>
    /// Reads width/height from the PNG IHDR chunk (big-endian ints at bytes 16..23).
    /// </summary>
    public static (int Width, int Height)? ReadPngSize(ReadOnlySpan<byte> header)
    {
        if (header.Length < HeaderLength)
            return null;

        var width = System.Buffers.Binary.BinaryPrimitives.ReadInt32BigEndian(header.Slice(16, 4));
        var height = System.Buffers.Binary.BinaryPrimitives.ReadInt32BigEndian(header.Slice(20, 4));

        return width > 0 && height > 0 ? (width, height) : null;
    }

    private static long ToBytes(int megabytes) => megabytes * 1024L * 1024L;
}
