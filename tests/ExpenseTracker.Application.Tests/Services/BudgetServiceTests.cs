using ExpenseTracker.Application.DTOs.Budgets;
using ExpenseTracker.Application.Services.Implementations;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;
using FluentValidation;
using FluentValidation.Results;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace ExpenseTracker.Application.Tests.Services;

public class BudgetServiceTests
{
    private readonly IBudgetRepository _budgetRepo = Substitute.For<IBudgetRepository>();
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IValidator<UpsertBudgetDto> _upsertValidator = Substitute.For<IValidator<UpsertBudgetDto>>();

    public BudgetServiceTests()
    {
        _upsertValidator.ValidateAsync(Arg.Any<IValidationContext>(), Arg.Any<CancellationToken>())
            .Returns(Task.FromResult(new ValidationResult()));
    }

    private BudgetService CreateSut() =>
        new(_budgetRepo, _categoryRepo, _upsertValidator);

    // ---------- GetBudgetsAsync ----------

    [Fact]
    public async Task GetBudgetsAsync_ReturnsMappedBudgets()
    {
        var categoryId = Guid.NewGuid();
        var budgets = new List<Budget>
        {
            Budget.Create(categoryId, 100m, 7, 2026),
            Budget.Create(categoryId, 200m, 7, 2026),
        };
        _budgetRepo.GetByMonthAndYearAsync(7, 2026).Returns(budgets);

        var result = (await CreateSut().GetBudgetsAsync(7, 2026)).ToList();

        Assert.Equal(2, result.Count);
        Assert.Equal(100m, result[0].LimitAmount);
        Assert.Equal(200m, result[1].LimitAmount);
    }

    // ---------- UpsertBudgetAsync ----------

    [Fact]
    public async Task UpsertBudgetAsync_CreatesNewBudget_WhenNoneExists()
    {
        var categoryId = Guid.NewGuid();
        var dto = new UpsertBudgetDto(categoryId, 500m, 7, 2026);
        _categoryRepo.GetByIdAsync(categoryId).Returns(Category.Create("Food", "#fff"));
        _budgetRepo.GetByCategoryAndMonthAsync(categoryId, 7, 2026).Returns((Budget?)null);

        Budget? created = null;
        _budgetRepo.When(r => r.AddAsync(Arg.Any<Budget>()))
            .Do(ci => created = ci.Arg<Budget>());
        _budgetRepo.GetByIdAsync(Arg.Any<Guid>()).Returns(_ => created);

        var result = await CreateSut().UpsertBudgetAsync(dto);

        Assert.Equal(500m, result.LimitAmount);
        await _budgetRepo.Received(1).AddAsync(Arg.Any<Budget>());
        await _budgetRepo.DidNotReceive().UpdateAsync(Arg.Any<Budget>());
    }

    [Fact]
    public async Task UpsertBudgetAsync_UpdatesExistingBudget_WhenPresent()
    {
        var categoryId = Guid.NewGuid();
        var dto = new UpsertBudgetDto(categoryId, 999m, 7, 2026);
        _categoryRepo.GetByIdAsync(categoryId).Returns(Category.Create("Food", "#fff"));
        var existing = Budget.Create(categoryId, 100m, 7, 2026);
        _budgetRepo.GetByCategoryAndMonthAsync(categoryId, 7, 2026).Returns(existing);
        _budgetRepo.GetByIdAsync(Arg.Any<Guid>()).Returns(existing);

        var result = await CreateSut().UpsertBudgetAsync(dto);

        Assert.Equal(999m, result.LimitAmount);
        await _budgetRepo.Received(1).UpdateAsync(existing);
        await _budgetRepo.DidNotReceive().AddAsync(Arg.Any<Budget>());
    }

    [Fact]
    public async Task UpsertBudgetAsync_ThrowsKeyNotFound_WhenCategoryMissing()
    {
        var categoryId = Guid.NewGuid();
        var dto = new UpsertBudgetDto(categoryId, 500m, 7, 2026);
        _categoryRepo.GetByIdAsync(categoryId).Returns((Category?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => CreateSut().UpsertBudgetAsync(dto));
        await _budgetRepo.DidNotReceive().AddAsync(Arg.Any<Budget>());
        await _budgetRepo.DidNotReceive().UpdateAsync(Arg.Any<Budget>());
    }

    [Fact]
    public async Task UpsertBudgetAsync_ThrowsValidation_WhenInvalid()
    {
        var dto = new UpsertBudgetDto(Guid.NewGuid(), -1m, 13, 2026);
        _upsertValidator.ValidateAsync(Arg.Any<IValidationContext>(), Arg.Any<CancellationToken>())
            .Throws(new ValidationException("Invalid budget."));

        await Assert.ThrowsAsync<ValidationException>(() => CreateSut().UpsertBudgetAsync(dto));
        await _categoryRepo.DidNotReceive().GetByIdAsync(Arg.Any<Guid>());
    }

    // ---------- DeleteBudgetAsync ----------

    [Fact]
    public async Task DeleteBudgetAsync_ThrowsArgument_WhenIdEmpty()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => CreateSut().DeleteBudgetAsync(Guid.Empty));
    }

    [Fact]
    public async Task DeleteBudgetAsync_ThrowsKeyNotFound_WhenMissing()
    {
        var id = Guid.NewGuid();
        _budgetRepo.GetByIdAsync(id).Returns((Budget?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => CreateSut().DeleteBudgetAsync(id));
    }

    [Fact]
    public async Task DeleteBudgetAsync_Deletes_WhenFound()
    {
        var id = Guid.NewGuid();
        var budget = Budget.Create(Guid.NewGuid(), 100m, 7, 2026);
        _budgetRepo.GetByIdAsync(id).Returns(budget);

        await CreateSut().DeleteBudgetAsync(id);

        await _budgetRepo.Received(1).DeleteAsync(budget);
    }
}
