namespace Domain.MerchItems;

public class MerchItem
{
    public MerchItemId Id { get; }
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public MerchCategory Category { get; private set; }
    public List<string> AvailableColors { get; private set; } = new();
    public string? ModelFilePath { get; private set; }
    public string? PreviewImagePath { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private MerchItem(MerchItemId id, string name, string? description, MerchCategory category,
        List<string> availableColors, bool isActive, DateTime createdAt, DateTime updatedAt)
    {
        Id = id;
        Name = name;
        Description = description;
        Category = category;
        AvailableColors = availableColors;
        IsActive = isActive;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    public static MerchItem New(MerchItemId id, string name, string? description, MerchCategory category,
        IEnumerable<string> availableColors)
    {
        return new MerchItem(id, name, description, category, availableColors.ToList(),
            true, DateTime.UtcNow, DateTime.UtcNow);
    }

    public void Update(string name, string? description, MerchCategory category, IEnumerable<string> availableColors)
    {
        Name = name;
        Description = description;
        Category = category;
        AvailableColors = availableColors.ToList();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetModel(string modelFilePath)
    {
        ModelFilePath = modelFilePath;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetPreview(string previewImagePath)
    {
        PreviewImagePath = previewImagePath;
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
