using ExpenseTracker.Application.DTOs.Budgets;
using ExpenseTracker.Application.Services.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;
using FluentValidation;

namespace ExpenseTracker.Application.Services.Implementations;

public class BudgetService(IBudgetRepository budgetRepo, ICategoryRepository categoryRepo, IValidator<CreateBudgetDto> createValidator, IValidator<UpdateBudgetDto> updateValidator) : IBudgetService
{
    private readonly IBudgetRepository _budgetRepo = budgetRepo;
    private readonly ICategoryRepository _categoryRepo = categoryRepo;
    private readonly IValidator<CreateBudgetDto> _createValidator = createValidator;
    private readonly IValidator<UpdateBudgetDto> _updateValidator = updateValidator;

    public async Task<IEnumerable<BudgetResponseDto>> GetBudgetsAsync(int month, int year)
    {
        var budgets = await _budgetRepo.GetByMonthAndYearAsync(month, year);
        return budgets.Select(MapToDto);
    }

    public async Task<BudgetResponseDto> CreateBudgetAsync(CreateBudgetDto dto)
    {
        await _createValidator.ValidateAndThrowAsync(dto);

        _ = await _categoryRepo.GetByIdAsync(dto.CategoryId) ?? throw new KeyNotFoundException($"Category '{dto.CategoryId}' not found.");

        var existing = await _budgetRepo.GetByCategoryAndMonthAsync(dto.CategoryId, dto.Month, dto.Year);
        if (existing is not null)
            throw new InvalidOperationException($"A budget for this category already exists for {dto.Month:00}/{dto.Year}.");

        var budget = Budget.Create(dto.CategoryId, dto.LimitAmount, dto.Month, dto.Year);
        await _budgetRepo.AddAsync(budget);

        budget = (await _budgetRepo.GetByIdAsync(budget.Id))!;
        return MapToDto(budget);
    }

    public async Task<BudgetResponseDto> UpdateBudgetAsync(UpdateBudgetDto dto)
    {
        await _updateValidator.ValidateAndThrowAsync(dto);

        var budget = await _budgetRepo.GetByIdAsync(dto.Id) ?? throw new KeyNotFoundException($"Budget '{dto.Id}' not found.");

        budget.UpdateLimit(dto.LimitAmount);
        await _budgetRepo.UpdateAsync(budget);

        budget = (await _budgetRepo.GetByIdAsync(budget.Id))!;
        return MapToDto(budget);
    }

    public async Task DeleteBudgetAsync(DeleteBudgetDto dto)
    {
        if (dto.Id == Guid.Empty)
            throw new ArgumentException("Budget ID cannot be empty.", nameof(dto.Id));

        var budget = await _budgetRepo.GetByIdAsync(dto.Id) ?? throw new KeyNotFoundException($"Budget '{dto.Id}' not found.");

        await _budgetRepo.DeleteAsync(budget);
    }

    private static BudgetResponseDto MapToDto(Budget b) => new(
        b.Id, b.CategoryId, b.Category?.Name ?? string.Empty, b.Category?.Color ?? string.Empty,
        b.LimitAmount, b.Month, b.Year, b.CreatedAt, b.UpdatedAt
    );
}