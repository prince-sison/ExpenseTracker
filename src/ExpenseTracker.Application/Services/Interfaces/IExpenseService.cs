using ExpenseTracker.Application.DTOs.Expenses;

namespace ExpenseTracker.Application.Services.Interfaces;

public interface IExpenseService
{
    Task<IEnumerable<ExpenseResponseDto>> GetExpensesAsync(int month, int year, Guid? categoryId = null);
    Task<ExpenseResponseDto?> GetExpenseByIdAsync(Guid id);
    Task<ExpenseResponseDto> CreateExpenseAsync(CreateExpenseDto dto);
    Task<ExpenseResponseDto> UpdateExpenseAsync(Guid id, UpdateExpenseDto dto);
    Task DeleteExpenseAsync(Guid id);
}