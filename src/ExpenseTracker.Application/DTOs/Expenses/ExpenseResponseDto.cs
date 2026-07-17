namespace ExpenseTracker.Application.DTOs.Expenses;

public record ExpenseResponseDto(
    Guid Id,
    decimal Amount,
    string Description,
    Guid CategoryId,
    string CategoryName,
    string CategoryColor,
    DateOnly Date,
    DateTime CreatedAt,
    DateTime UpdatedAt
);