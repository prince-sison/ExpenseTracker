using ExpenseTracker.Domain.Common;

namespace ExpenseTracker.Domain.Entities;

public class Expense : BaseEntity
{
    public decimal Amount { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public Guid CategoryId { get; private set; }
    public DateOnly Date { get; private set; }
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

    public Category Category { get; private set; } = null!;

    private Expense() { }

    public static Expense Create(decimal amount, string description, Guid categoryId, DateOnly date)
        => new() { Amount = amount, Description = description, CategoryId = categoryId, Date = date };

    public void Update(decimal amount, string description, Guid categoryId, DateOnly date)
    {
        Amount = amount;
        Description = description;
        CategoryId = categoryId;
        Date = date;
        UpdatedAt = DateTime.UtcNow;
    }
}