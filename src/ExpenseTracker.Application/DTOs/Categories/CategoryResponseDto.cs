namespace ExpenseTracker.Application.DTOs.Categories;

public record CategoryResponseDto(
    Guid Id,
    string Name,
    string Color,
    bool IsDefault,
    DateTime CreatedAt
);
