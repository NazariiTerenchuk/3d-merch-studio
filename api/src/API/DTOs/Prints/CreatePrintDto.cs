namespace API.DTOs.Prints;

public record CreatePrintDto(
    string Name,
    string? Description,
    string Category);
