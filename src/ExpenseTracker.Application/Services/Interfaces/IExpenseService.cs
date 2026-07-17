using ExpenseTracker.Application.DTOs.Expenses;

namespace ExpenseTracker.Application.Services.Interfaces;

public interface IExpenseService
{
    Task<IEnumerable<ExpenseResponseDto>> GetExpensesAsync(int month, int year, Guid? categoryId = null);
    Task<ExpenseResponseDto> CreateExpenseAsync(CreateExpenseDto dto);
    Task<ExpenseResponseDto> UpdateExpenseAsync(UpdateExpenseDto dto);
    Task DeleteExpenseAsync(Guid id);
}