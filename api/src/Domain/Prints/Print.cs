namespace Domain.Prints;

public class Print
{
    public PrintId Id { get; }
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public PrintCategory Category { get; private set; }
    public string? ImageFilePath { get; private set; }
    public int? WidthPx { get; private set; }
    public int? HeightPx { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Print(PrintId id, string name, string? description, PrintCategory category,
        bool isActive, DateTime createdAt, DateTime updatedAt)
    {
        Id = id;
        Name = name;
        Description = description;
        Category = category;
        IsActive = isActive;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    public static Print New(PrintId id, string name, string? description, PrintCategory category)
    {
        return new Print(id, name, description, category, true, DateTime.UtcNow, DateTime.UtcNow);
    }

    public void Update(string name, string? description, PrintCategory category)
    {
        Name = name;
        Description = description;
        Category = category;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetImage(string imageFilePath, int widthPx, int heightPx)
    {
        ImageFilePath = imageFilePath;
        WidthPx = widthPx;
        HeightPx = heightPx;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }
}
