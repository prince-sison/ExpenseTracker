namespace ExpenseTracker.Application.DTOs.Budgets;

public record BudgetResponseDto(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
    string CategoryColor,
    decimal LimitAmount,
    int Month,
    int Year,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
