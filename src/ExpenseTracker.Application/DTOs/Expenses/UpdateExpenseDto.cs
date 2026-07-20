namespace ExpenseTracker.Application.DTOs.Expenses;

public record UpdateExpenseDto(
    decimal Amount,
    string Description,
    Guid CategoryId,
    DateOnly Date
);