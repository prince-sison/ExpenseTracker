using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;
using ExpenseTracker.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Repositories;

public class ExpenseRepository(AppDbContext context) : IExpenseRepository
{
    private readonly AppDbContext _context = context;

    public async Task<Expense> AddAsync(Expense expense)
    {
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();
        return expense;
    }

    public async Task DeleteAsync(Expense expense)
    {
        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Expense>> GetAllAsync(int month, int year, Guid? categoryId = null)
    {
        var start = new DateOnly(year, month, 1);
        var end = start.AddMonths(1);

        return await _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.Date >= start && e.Date < end && (categoryId == null || e.CategoryId == categoryId))
            .OrderByDescending(e => e.Date)
            .ToListAsync();
    }

    public async Task<Expense?> GetByIdAsync(Guid id)
        => await _context.Expenses.Include(e => e.Category).FirstOrDefaultAsync(e => e.Id == id);

    public async Task<IEnumerable<(DateOnly Date, decimal Total)>> GetDailyTotalsAsync(int month, int year)
    {
        var start = new DateOnly(year, month, 1);
        var end = start.AddMonths(1);

        return await _context.Expenses
            .Where(e => e.Date >= start && e.Date < end)
            .GroupBy(e => e.Date)
            .Select(g => new { Date = g.Key, Total = g.Sum(e => e.Amount) })
            .OrderBy(x => x.Date)
            .Select(x => ValueTuple.Create(x.Date, x.Total))
            .ToListAsync();
    }

    public async Task<Dictionary<Guid, decimal>> GetTotalByCategoryAsync(int month, int year)
    {
        var start = new DateOnly(year, month, 1);
        var end = start.AddMonths(1);

        return await _context.Expenses
            .Where(e => e.Date >= start && e.Date < end)
            .GroupBy(e => e.CategoryId)
            .Select(g => new { CategoryId = g.Key, Total = g.Sum(e => e.Amount) })
            .ToDictionaryAsync(x => x.CategoryId, x => x.Total);
    }

    public async Task UpdateAsync(Expense expense)
    {
        _context.Expenses.Update(expense);
        await _context.SaveChangesAsync();
    }
}