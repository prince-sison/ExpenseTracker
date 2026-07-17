namespace ExpenseTracker.Application.DTOs.Categories;

public record UpdateCategoryDto(
    Guid Id,
    string Name,
    string Color
);
