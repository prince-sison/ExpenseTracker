using ExpenseTracker.Application.Services.Implementations;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;
using NSubstitute;

namespace ExpenseTracker.Application.Tests.Services;

public class DashboardServiceTests
{
    private readonly IExpenseRepository _expenseRepo = Substitute.For<IExpenseRepository>();
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IBudgetRepository _budgetRepo = Substitute.For<IBudgetRepository>();

    private DashboardService CreateSut() =>
        new(_expenseRepo, _categoryRepo, _budgetRepo);

    [Fact]
    public async Task GetSummaryAsync_ReturnsCorrectTotalSpent_ForMockExpenses()
    {
        // Arrange
        const int month = 7;
        const int year = 2026;
        var categoryId = Guid.NewGuid();

        var expenses = new List<Expense>
        {
            Expense.Create(25.50m, "Groceries", categoryId, new DateOnly(year, month, 3)),
            Expense.Create(100.00m, "Electricity", categoryId, new DateOnly(year, month, 10)),
            Expense.Create(9.99m, "Coffee", categoryId, new DateOnly(year, month, 15)),
        };
        var expectedTotal = 135.49m;

        _expenseRepo.GetAllAsync(month, year, null).Returns(expenses);
        _expenseRepo.GetTotalByCategoryAsync(month, year)
            .Returns(new Dictionary<Guid, decimal> { [categoryId] = expectedTotal });
        _expenseRepo.GetDailyTotalsAsync(month, year)
            .Returns([]);
        _categoryRepo.GetAllAsync().Returns([]);
        _budgetRepo.GetByMonthAndYearAsync(month, year).Returns([]);

        var sut = CreateSut();

        // Act
        var result = await sut.GetSummaryAsync(month, year);

        // Assert
        Assert.Equal(expectedTotal, result.TotalSpent);
        Assert.Equal(month, result.Month);
        Assert.Equal(year, result.Year);
    }
}
