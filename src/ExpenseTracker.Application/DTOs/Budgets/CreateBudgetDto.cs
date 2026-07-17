namespace ExpenseTracker.Application.DTOs.Budgets;

public record CreateBudgetDto(
    Guid CategoryId,
    decimal LimitAmount,
    int Month,
    int Year
);
