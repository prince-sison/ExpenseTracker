using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;
using ExpenseTracker.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class BudgetRepository(AppDbContext context) : IBudgetRepository
{
    private readonly AppDbContext _context = context;

    public async Task<Budget> AddAsync(Budget budget)
    {
        await _context.Budgets.AddAsync(budget);
        await _context.SaveChangesAsync();
        return budget;
    }

    public async Task DeleteAsync(Budget budget)
    {
        _context.Budgets.Remove(budget);
        await _context.SaveChangesAsync();
    }

    public async Task<Budget?> GetByCategoryAndMonthAsync(Guid categoryId, int month, int year)
        => await _context.Budgets.Include(b => b.Category).FirstOrDefaultAsync(b => b.CategoryId == categoryId && b.Month == month && b.Year == year);

    public async Task<Budget?> GetByIdAsync(Guid id)
        => await _context.Budgets.Include(b => b.Category).FirstOrDefaultAsync(b => b.Id == id);

    public async Task<IEnumerable<Budget>> GetByMonthAndYearAsync(int month, int year)
        => await _context.Budgets.Include(b => b.Category).Where(b => b.Month == month && b.Year == year).ToListAsync();

    public Task UpdateAsync(Budget budget)
    {
        _context.Budgets.Update(budget);
        return _context.SaveChangesAsync();
    }
}