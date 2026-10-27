using Domain.MerchItems;

namespace Domain.Configurations;

public class SavedConfiguration
{
    public SavedConfigurationId Id { get; }
    public string Name { get; private set; }
    public MerchItemId MerchItemId { get; private set; }
    public MerchItem? MerchItem { get; set; }
    public string BaseColor { get; private set; }
    public string ShareCode { get; private set; }
    public List<ConfigurationPrint> Prints { get; private set; } = new();
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private SavedConfiguration(SavedConfigurationId id, string name, MerchItemId merchItemId, string baseColor,
        string shareCode, DateTime createdAt, DateTime updatedAt)
    {
        Id = id;
        Name = name;
        MerchItemId = merchItemId;
        BaseColor = baseColor;
        ShareCode = shareCode;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    public static SavedConfiguration New(SavedConfigurationId id, string name, MerchItemId merchItemId,
        string baseColor)
    {
        return new SavedConfiguration(id, name, merchItemId, baseColor, ShareCodeGenerator.Generate(),
            DateTime.UtcNow, DateTime.UtcNow);
    }

    public void Update(string name, string baseColor)
    {
        Name = name;
        BaseColor = baseColor;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ReplacePrints(IEnumerable<ConfigurationPrint> prints)
    {
        Prints.Clear();
        Prints.AddRange(prints);
        UpdatedAt = DateTime.UtcNow;
    }
}
