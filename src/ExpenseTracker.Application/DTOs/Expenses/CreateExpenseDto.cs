namespace ExpenseTracker.Application.DTOs.Expenses;

public record CreateExpenseDto(
    decimal Amount,
    string Description,
    Guid CategoryId,
    DateOnly Date
);