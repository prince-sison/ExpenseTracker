using ExpenseTracker.Application.DTOs.Budgets;
using FluentValidation;

namespace ExpenseTracker.Application.Validators;

public class UpdateBudgetValidator : AbstractValidator<UpdateBudgetDto>
{
    public UpdateBudgetValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("A budget id is required.");

        RuleFor(x => x.LimitAmount)
            .GreaterThan(0).WithMessage("Limit amount must be greater than zero.")
            .LessThanOrEqualTo(999_999.99m).WithMessage("Limit amount exceeds the maximum allowed.");
    }
}
