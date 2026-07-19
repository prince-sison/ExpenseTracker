namespace ExpenseTracker.Application.DTOs.Budgets;

public record UpsertBudgetDto(
    Guid CategoryId,
    decimal LimitAmount,
    int Month,
    int Year
);
