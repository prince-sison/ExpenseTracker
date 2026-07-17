using ExpenseTracker.Application.DTOs.Expenses;
using FluentValidation;

namespace ExpenseTracker.Application.Validators;

public class CreateExpenseValidator : AbstractValidator<CreateExpenseDto>
{
    public CreateExpenseValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than zero.")
            .LessThanOrEqualTo(999_999.99m).WithMessage("Amount exceeds the maximum allowed.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(255).WithMessage("Description cannot exceed 255 characters.");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("A category is required.");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required.")
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Expense date cannot be in the future.");
    }
}