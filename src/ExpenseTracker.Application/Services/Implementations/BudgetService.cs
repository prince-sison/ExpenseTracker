using ExpenseTracker.Application.DTOs.Budgets;
using ExpenseTracker.Application.Services.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;
using FluentValidation;

namespace ExpenseTracker.Application.Services.Implementations;

public class BudgetService(IBudgetRepository budgetRepo, ICategoryRepository categoryRepo, IValidator<UpsertBudgetDto> upsertValidator) : IBudgetService
{
    private readonly IBudgetRepository _budgetRepo = budgetRepo;
    private readonly ICategoryRepository _categoryRepo = categoryRepo;
    private readonly IValidator<UpsertBudgetDto> _upsertValidator = upsertValidator;

    public async Task<IEnumerable<BudgetResponseDto>> GetBudgetsAsync(int month, int year)
    {
        var budgets = await _budgetRepo.GetByMonthAndYearAsync(month, year);
        return budgets.Select(MapToDto);
    }

    public async Task<BudgetResponseDto> UpsertBudgetAsync(UpsertBudgetDto dto)
    {
        await _upsertValidator.ValidateAndThrowAsync(dto);

        _ = await _categoryRepo.GetByIdAsync(dto.CategoryId) ?? throw new KeyNotFoundException($"Category '{dto.CategoryId}' not found.");

        var budget = await _budgetRepo.GetByCategoryAndMonthAsync(dto.CategoryId, dto.Month, dto.Year);
        if (budget is null)
        {
            budget = Budget.Create(dto.CategoryId, dto.LimitAmount, dto.Month, dto.Year);
            await _budgetRepo.AddAsync(budget);
        }
        else
        {
            budget.UpdateLimit(dto.LimitAmount);
            await _budgetRepo.UpdateAsync(budget);
        }

        budget = (await _budgetRepo.GetByIdAsync(budget.Id))!;
        return MapToDto(budget);
    }

    public async Task DeleteBudgetAsync(Guid id)
    {
        if (id == Guid.Empty)
            throw new ArgumentException("Budget ID cannot be empty.", nameof(id));

        var budget = await _budgetRepo.GetByIdAsync(id) ?? throw new KeyNotFoundException($"Budget '{id}' not found.");

        await _budgetRepo.DeleteAsync(budget);
    }

    private static BudgetResponseDto MapToDto(Budget b) => new(
        b.Id, b.CategoryId, b.Category?.Name ?? string.Empty, b.Category?.Color ?? string.Empty,
        b.LimitAmount, b.Month, b.Year, b.CreatedAt, b.UpdatedAt
    );
}