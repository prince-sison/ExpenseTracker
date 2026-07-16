using ExpenseTracker.Domain.Common;

namespace ExpenseTracker.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Color { get; private set; } = "#6B7280";
    public bool IsDefault { get; private set; }

    private Category() { }

    public static Category Create(string name, string color, bool isDefault = false)
        => new () { Name = name, Color = color, IsDefault = isDefault };
    
    public void Update(string name, string color)
    {
        Name = name;
        Color = color;
    }
}