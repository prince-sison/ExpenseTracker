using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Domain.Repositories;

public interface IBudgetRepository
{
    Task<IEnumerable<Budget>> GetByMonthAndYearAsync(int month, int year);
    Task<Budget?> GetByCategoryAndMonthAsync(Guid categoryId, int month, int year);
    Task<Budget?> GetByIdAsync(Guid id);
    Task<Budget> AddAsync(Budget budget);
    Task UpdateAsync(Budget budget);
    Task DeleteAsync(Budget budget);
}