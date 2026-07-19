using ExpenseTracker.Application.DTOs.Budgets;
using FluentValidation;

namespace ExpenseTracker.Application.Validators;

public class UpsertBudgetValidator : AbstractValidator<UpsertBudgetDto>
{
    public UpsertBudgetValidator()
    {
        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("A category is required.");

        RuleFor(x => x.LimitAmount)
            .GreaterThan(0).WithMessage("Limit amount must be greater than zero.")
            .LessThanOrEqualTo(999_999.99m).WithMessage("Limit amount exceeds the maximum allowed.");

        RuleFor(x => x.Month)
            .InclusiveBetween(1, 12).WithMessage("Month must be between 1 and 12.");

        RuleFor(x => x.Year)
            .InclusiveBetween(2000, 2100).WithMessage("Year must be between 2000 and 2100.");
    }
}
