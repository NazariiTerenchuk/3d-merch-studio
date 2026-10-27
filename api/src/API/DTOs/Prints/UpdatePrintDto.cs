namespace API.DTOs.Prints;

public record UpdatePrintDto(
    string Name,
    string? Description,
    string Category,
    bool IsActive);
