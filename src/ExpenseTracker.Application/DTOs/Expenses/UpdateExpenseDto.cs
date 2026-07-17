namespace ExpenseTracker.Application.DTOs.Expenses;

public record UpdateExpenseDto(
    Guid Id,
    decimal Amount,
    string Description,
    Guid CategoryId,
    DateOnly Date
);