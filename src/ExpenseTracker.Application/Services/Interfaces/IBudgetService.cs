using ExpenseTracker.Application.DTOs.Budgets;

namespace ExpenseTracker.Application.Services.Interfaces;

public interface IBudgetService
{
    Task<IEnumerable<BudgetResponseDto>> GetBudgetsAsync(int month, int year);
    Task<BudgetResponseDto> CreateBudgetAsync(CreateBudgetDto dto);
    Task<BudgetResponseDto> UpdateBudgetAsync(UpdateBudgetDto dto);
    Task DeleteBudgetAsync(Guid id);
}