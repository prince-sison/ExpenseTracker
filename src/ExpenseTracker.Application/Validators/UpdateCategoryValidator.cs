using ExpenseTracker.Application.DTOs.Categories;
using FluentValidation;

namespace ExpenseTracker.Application.Validators;

public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryDto>
{
    public UpdateCategoryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("A category id is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Category name is required.")
            .MaximumLength(50).WithMessage("Category name cannot exceed 50 characters.");

        RuleFor(x => x.Color)
            .NotEmpty().WithMessage("Color is required.")
            .Matches("^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$")
            .WithMessage("Color must be a valid hex code (e.g. #6B7280).");
    }
}
