using ExpenseTracker.Application.DTOs.Expenses;

namespace ExpenseTracker.Application.DTOs.Dashboard;

public record DashboardSummaryDto(
    int Month,
    int Year,
    decimal TotalSpent,
    IEnumerable<BudgetUtilizationDto> BudgetUtilization,
    IEnumerable<DailySpendingDto> DailySpending,
    IEnumerable<ExpenseResponseDto> RecentExpenses
);

public record BudgetUtilizationDto(
    Guid CategoryId,
    string CategoryName,
    string CategoryColor,
    decimal Spent,
    decimal? Limit,
    double? Percentage,
    bool IsOverBudget
);

public record DailySpendingDto(DateOnly Date, decimal Total);