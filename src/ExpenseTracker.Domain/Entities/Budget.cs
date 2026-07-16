using ExpenseTracker.Domain.Common;

namespace ExpenseTracker.Domain.Entities;

public class Budget : BaseEntity
{
    public Guid CategoryId { get; private set; }
    public decimal LimitAmount { get; private set; }
    public int Month { get; private set; }
    public int Year { get; private set; }
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

    public Category? Category { get; private set; }

    private Budget() { }

    public static Budget Create(Guid categoryId, decimal limitAmount, int month, int year)
        => new() { CategoryId = categoryId, LimitAmount = limitAmount, Month = month, Year = year };

    public void UpdateLimit(decimal limitAmount)
    {
        LimitAmount = limitAmount;
        UpdatedAt = DateTime.UtcNow;
    }
}