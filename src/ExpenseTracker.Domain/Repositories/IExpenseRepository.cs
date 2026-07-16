using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Domain.Repositories;

public interface IExpenseRepository
{
    Task<IEnumerable<Expense>> GetAllAsync(int month, int year, Guid? categoryId = null);
    Task<Expense?> GetByIdAsync(Guid id);
    Task<Expense> AddAsync(Expense expense);
    Task UpdateAsync(Expense expense);
    Task DeleteAsync(Expense expense);
    Task<Dictionary<Guid, decimal>> GetTotalByCategoryAsync(int month, int year);
    Task<IEnumerable<(DateOnly Date, decimal Total)>> GetDailyTotalsAsync(int month, int year);
}