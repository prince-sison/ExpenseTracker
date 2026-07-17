using ExpenseTracker.Application.DTOs.Expenses;
using ExpenseTracker.Application.Services.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;
using FluentValidation;

namespace ExpenseTracker.Application.Services.Implementations;

public class ExpenseService(IExpenseRepository expenseRepo, ICategoryRepository categoryRepo, IValidator<CreateExpenseDto> createValidator, IValidator<UpdateExpenseDto> updateValidator) : IExpenseService
{
    private readonly IExpenseRepository _expenseRepo = expenseRepo;
    private readonly ICategoryRepository _categoryRepo = categoryRepo;
    private readonly IValidator<CreateExpenseDto> _createValidator = createValidator;
    private readonly IValidator<UpdateExpenseDto> _updateValidator = updateValidator;

    public async Task<ExpenseResponseDto> CreateExpenseAsync(CreateExpenseDto dto)
    {
        await _createValidator.ValidateAndThrowAsync(dto);

        var category = await _categoryRepo.GetByIdAsync(dto.CategoryId) ?? throw new KeyNotFoundException($"Category '{dto.CategoryId}' not found.");

        var expense = Expense.Create(dto.Amount, dto.Description, dto.CategoryId, dto.Date);
        await _expenseRepo.AddAsync(expense);

        expense = (await _expenseRepo.GetByIdAsync(expense.Id))!;
        return MapToDto(expense);
    }

    public async Task DeleteExpenseAsync(Guid id)
    {
        if (id == Guid.Empty)
            throw new ArgumentException("Expense ID cannot be empty.", nameof(id));

        var expense = await _expenseRepo.GetByIdAsync(id) ?? throw new KeyNotFoundException($"Expense '{id}' not found.");

        await _expenseRepo.DeleteAsync(expense);
    }

    public async Task<IEnumerable<ExpenseResponseDto>> GetExpensesAsync(int month, int year, Guid? categoryId = null)
    {
        var expenses = await _expenseRepo.GetAllAsync(month, year, categoryId);
        return expenses.Select(MapToDto);
    }

    public async Task<ExpenseResponseDto> UpdateExpenseAsync(UpdateExpenseDto dto)
    {
        await _updateValidator.ValidateAndThrowAsync(dto);

        var expense = await _expenseRepo.GetByIdAsync(dto.Id) ?? throw new KeyNotFoundException($"Expense '{dto.Id}' not found.");

        expense.Update(dto.Amount, dto.Description, dto.CategoryId, dto.Date);
        await _expenseRepo.UpdateAsync(expense);

        expense = (await _expenseRepo.GetByIdAsync(expense.Id))!;
        return MapToDto(expense);
    }

    private static ExpenseResponseDto MapToDto(Expense e) => new(
        e.Id, e.Amount, e.Description,
        e.CategoryId, e.Category?.Name ?? string.Empty, e.Category?.Color ?? string.Empty,
        e.Date, e.CreatedAt, e.UpdatedAt
    );
}