using System.Security.Cryptography;

namespace Domain.Configurations;

public static class ShareCodeGenerator
{
    public const int Length = 8;

    private const string Alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    public static string Generate()
        => RandomNumberGenerator.GetString(Alphabet, Length);
}
