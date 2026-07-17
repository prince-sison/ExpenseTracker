using ExpenseTracker.Application.DTOs.Dashboard;
using ExpenseTracker.Application.DTOs.Expenses;
using ExpenseTracker.Application.Services.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;

namespace ExpenseTracker.Application.Services.Implementations;

public class DashboardService(IExpenseRepository expenseRepo, ICategoryRepository categoryRepo, IBudgetRepository budgetRepo) : IDashboardService
{
    private readonly IExpenseRepository _expenseRepo = expenseRepo;
    private readonly ICategoryRepository _categoryRepo = categoryRepo;
    private readonly IBudgetRepository _budgetRepo = budgetRepo;

    public async Task<DashboardSummaryDto> GetSummaryAsync(int month, int year)
    {
        var expenses = (await _expenseRepo.GetAllAsync(month, year)).ToList();
        var categories = (await _categoryRepo.GetAllAsync()).ToList();
        var budgets = (await _budgetRepo.GetByMonthAndYearAsync(month, year)).ToList();
        var totalsByCategory = await _expenseRepo.GetTotalByCategoryAsync(month, year);
        var dailyTotals = await _expenseRepo.GetDailyTotalsAsync(month, year);

        var totalSpent = expenses.Sum(e => e.Amount);
        
        var budgetUtilization = categories.Select(cat =>
        {
            var spent = totalsByCategory.GetValueOrDefault(cat.Id, 0m);
            var budget = budgets.FirstOrDefault(b => b.CategoryId == cat.Id);
            var limit = budget?.LimitAmount;
            var percentage = limit.HasValue && limit > 0
                ? (double)(spent / limit.Value * 100)
                : (double?)null;

            return new BudgetUtilizationDto(cat.Id, cat.Name, cat.Color,
                spent, limit, percentage,
                IsOverBudget: limit.HasValue && spent > limit);
        }).Where(b => b.Spent > 0 || b.Limit.HasValue);

        var dailySpending = BuildDailySpending(month, year, dailyTotals);

        var recentExpenses = expenses
            .OrderByDescending(e => e.Date).ThenByDescending(e => e.CreatedAt)
            .Take(5)
            .Select(MapExpenseToDto);

        return new DashboardSummaryDto(
            month, year, totalSpent, budgetUtilization, dailySpending, recentExpenses
        );
    }

    private static IEnumerable<DailySpendingDto> BuildDailySpending(int month, int year, IEnumerable<(DateOnly Date, decimal Total)> actuals)
    {
        var daysInMonth = DateTime.DaysInMonth(year, month);
        var lookup = actuals.ToDictionary(x => x.Date, x => x.Total);

        return Enumerable.Range(1, daysInMonth)
            .Select(day =>
            {
                var date = new DateOnly(year, month, day);
                return new DailySpendingDto(date, lookup.GetValueOrDefault(date, 0m));
            });
    }

    private static ExpenseResponseDto MapExpenseToDto(Expense e) => new(
        e.Id, e.Amount, e.Description,
        e.CategoryId, e.Category?.Name ?? string.Empty, e.Category?.Color ?? string.Empty,
        e.Date, e.CreatedAt, e.UpdatedAt
    );
}