namespace Application.Services.FileStorage;

public static class StoragePaths
{
    public const string Models = "models";
    public const string Prints = "prints";
    public const string Previews = "previews";

    public static string For(FileKind kind) => kind switch
    {
        FileKind.Model3D => Models,
        FileKind.PrintImage => Prints,
        FileKind.PreviewImage => Previews,
        _ => throw new ArgumentOutOfRangeException(nameof(kind), kind, null)
    };
}
