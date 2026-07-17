namespace ExpenseTracker.Application.DTOs.Budgets;

public record UpdateBudgetDto(
    Guid Id,
    decimal LimitAmount
);
