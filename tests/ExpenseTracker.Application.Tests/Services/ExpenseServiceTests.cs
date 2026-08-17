using ExpenseTracker.Application.DTOs.Expenses;
using ExpenseTracker.Application.Services.Implementations;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;
using FluentValidation;
using FluentValidation.Results;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace ExpenseTracker.Application.Tests.Services;

public class ExpenseServiceTests
{
    private readonly IExpenseRepository _expenseRepo = Substitute.For<IExpenseRepository>();
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IValidator<CreateExpenseDto> _createValidator = Substitute.For<IValidator<CreateExpenseDto>>();
    private readonly IValidator<UpdateExpenseDto> _updateValidator = Substitute.For<IValidator<UpdateExpenseDto>>();

    public ExpenseServiceTests()
    {
        // Validators pass by default; individual tests override to force failures.
        _createValidator.ValidateAsync(Arg.Any<IValidationContext>(), Arg.Any<CancellationToken>())
            .Returns(Task.FromResult(new ValidationResult()));
        _updateValidator.ValidateAsync(Arg.Any<IValidationContext>(), Arg.Any<CancellationToken>())
            .Returns(Task.FromResult(new ValidationResult()));
    }

    private ExpenseService CreateSut() =>
        new(_expenseRepo, _categoryRepo, _createValidator, _updateValidator);

    // ---------- CreateExpenseAsync ----------

    [Fact]
    public async Task CreateExpenseAsync_CreatesAndReturnsDto_WhenValidAndCategoryExists()
    {
        var categoryId = Guid.NewGuid();
        var dto = new CreateExpenseDto(50m, "Lunch", categoryId, new DateOnly(2026, 7, 1));
        _categoryRepo.GetByIdAsync(categoryId).Returns(Category.Create("Food", "#fff"));

        Expense? created = null;
        _expenseRepo.When(r => r.AddAsync(Arg.Any<Expense>()))
            .Do(ci => created = ci.Arg<Expense>());
        _expenseRepo.GetByIdAsync(Arg.Any<Guid>()).Returns(_ => created);

        var result = await CreateSut().CreateExpenseAsync(dto);

        Assert.Equal(50m, result.Amount);
        Assert.Equal("Lunch", result.Description);
        Assert.Equal(categoryId, result.CategoryId);
        await _expenseRepo.Received(1).AddAsync(Arg.Any<Expense>());
    }

    [Fact]
    public async Task CreateExpenseAsync_ThrowsKeyNotFound_WhenCategoryMissing()
    {
        var categoryId = Guid.NewGuid();
        var dto = new CreateExpenseDto(50m, "Lunch", categoryId, new DateOnly(2026, 7, 1));
        _categoryRepo.GetByIdAsync(categoryId).Returns((Category?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => CreateSut().CreateExpenseAsync(dto));
        await _expenseRepo.DidNotReceive().AddAsync(Arg.Any<Expense>());
    }

    [Fact]
    public async Task CreateExpenseAsync_ThrowsValidation_WhenInvalid()
    {
        var dto = new CreateExpenseDto(-1m, "", Guid.NewGuid(), new DateOnly(2026, 7, 1));
        _createValidator.ValidateAsync(Arg.Any<IValidationContext>(), Arg.Any<CancellationToken>())
            .Throws(new ValidationException("Invalid expense."));

        await Assert.ThrowsAsync<ValidationException>(() => CreateSut().CreateExpenseAsync(dto));
        await _categoryRepo.DidNotReceive().GetByIdAsync(Arg.Any<Guid>());
    }

    // ---------- GetExpensesAsync ----------

    [Fact]
    public async Task GetExpensesAsync_ReturnsMappedExpenses()
    {
        var categoryId = Guid.NewGuid();
        var expenses = new List<Expense>
        {
            Expense.Create(10m, "A", categoryId, new DateOnly(2026, 7, 1)),
            Expense.Create(20m, "B", categoryId, new DateOnly(2026, 7, 2)),
        };
        _expenseRepo.GetAllAsync(7, 2026, null).Returns(expenses);

        var result = (await CreateSut().GetExpensesAsync(7, 2026)).ToList();

        Assert.Equal(2, result.Count);
        Assert.Equal(10m, result[0].Amount);
        Assert.Equal(20m, result[1].Amount);
    }

    // ---------- GetExpenseByIdAsync ----------

    [Fact]
    public async Task GetExpenseByIdAsync_ThrowsArgument_WhenIdEmpty()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => CreateSut().GetExpenseByIdAsync(Guid.Empty));
    }

    [Fact]
    public async Task GetExpenseByIdAsync_ReturnsNull_WhenNotFound()
    {
        var id = Guid.NewGuid();
        _expenseRepo.GetByIdAsync(id).Returns((Expense?)null);

        var result = await CreateSut().GetExpenseByIdAsync(id);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetExpenseByIdAsync_ReturnsDto_WhenFound()
    {
        var id = Guid.NewGuid();
        var expense = Expense.Create(42m, "Book", Guid.NewGuid(), new DateOnly(2026, 7, 1));
        _expenseRepo.GetByIdAsync(id).Returns(expense);

        var result = await CreateSut().GetExpenseByIdAsync(id);

        Assert.NotNull(result);
        Assert.Equal(42m, result!.Amount);
        Assert.Equal("Book", result.Description);
    }

    // ---------- UpdateExpenseAsync ----------

    [Fact]
    public async Task UpdateExpenseAsync_UpdatesAndReturnsDto_WhenFound()
    {
        var id = Guid.NewGuid();
        var existing = Expense.Create(10m, "Old", Guid.NewGuid(), new DateOnly(2026, 1, 1));
        _expenseRepo.GetByIdAsync(Arg.Any<Guid>()).Returns(existing);
        var dto = new UpdateExpenseDto(99m, "New", Guid.NewGuid(), new DateOnly(2026, 2, 2));

        var result = await CreateSut().UpdateExpenseAsync(id, dto);

        Assert.Equal(99m, result.Amount);
        Assert.Equal("New", result.Description);
        await _expenseRepo.Received(1).UpdateAsync(existing);
    }

    [Fact]
    public async Task UpdateExpenseAsync_ThrowsKeyNotFound_WhenMissing()
    {
        var id = Guid.NewGuid();
        _expenseRepo.GetByIdAsync(id).Returns((Expense?)null);
        var dto = new UpdateExpenseDto(99m, "New", Guid.NewGuid(), new DateOnly(2026, 2, 2));

        await Assert.ThrowsAsync<KeyNotFoundException>(() => CreateSut().UpdateExpenseAsync(id, dto));
        await _expenseRepo.DidNotReceive().UpdateAsync(Arg.Any<Expense>());
    }

    // ---------- DeleteExpenseAsync ----------

    [Fact]
    public async Task DeleteExpenseAsync_ThrowsArgument_WhenIdEmpty()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => CreateSut().DeleteExpenseAsync(Guid.Empty));
    }

    [Fact]
    public async Task DeleteExpenseAsync_ThrowsKeyNotFound_WhenMissing()
    {
        var id = Guid.NewGuid();
        _expenseRepo.GetByIdAsync(id).Returns((Expense?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => CreateSut().DeleteExpenseAsync(id));
    }

    [Fact]
    public async Task DeleteExpenseAsync_Deletes_WhenFound()
    {
        var id = Guid.NewGuid();
        var expense = Expense.Create(10m, "X", Guid.NewGuid(), new DateOnly(2026, 1, 1));
        _expenseRepo.GetByIdAsync(id).Returns(expense);

        await CreateSut().DeleteExpenseAsync(id);

        await _expenseRepo.Received(1).DeleteAsync(expense);
    }
}
