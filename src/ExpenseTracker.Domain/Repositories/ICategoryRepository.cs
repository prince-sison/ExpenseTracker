using ExpenseTracker.Domain.Entities;

namespace ExpenseTracker.Domain.Repositories;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<Category> AddAsync(Category category);
    Task UpdateAsync(Category category);
    Task DeleteAsync(Category category);
}