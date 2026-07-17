using ExpenseTracker.Application.DTOs.Categories;
using ExpenseTracker.Application.Services.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;
using FluentValidation;

namespace ExpenseTracker.Application.Services.Implementations;

public class CategoryService(ICategoryRepository categoryRepo, IValidator<CreateCategoryDto> createValidator, IValidator<UpdateCategoryDto> updateValidator) : ICategoryService
{
    private readonly ICategoryRepository _categoryRepo = categoryRepo;
    private readonly IValidator<CreateCategoryDto> _createValidator = createValidator;
    private readonly IValidator<UpdateCategoryDto> _updateValidator = updateValidator;

    public async Task<IEnumerable<CategoryResponseDto>> GetCategoriesAsync()
    {
        var categories = await _categoryRepo.GetAllAsync();
        return categories.Select(MapToDto);
    }

    public async Task<CategoryResponseDto> CreateCategoryAsync(CreateCategoryDto dto)
    {
        await _createValidator.ValidateAndThrowAsync(dto);

        if (await _categoryRepo.ExistsByNameAsync(dto.Name))
            throw new InvalidOperationException($"A category named '{dto.Name}' already exists.");

        var category = Category.Create(dto.Name, dto.Color);
        await _categoryRepo.AddAsync(category);

        return MapToDto(category);
    }

    public async Task<CategoryResponseDto> UpdateCategoryAsync(UpdateCategoryDto dto)
    {
        await _updateValidator.ValidateAndThrowAsync(dto);

        var category = await _categoryRepo.GetByIdAsync(dto.Id) ?? throw new KeyNotFoundException($"Category '{dto.Id}' not found.");

        category.Update(dto.Name, dto.Color);
        await _categoryRepo.UpdateAsync(category);

        return MapToDto(category);
    }

    public async Task DeleteCategoryAsync(Guid id)
    {
        if (id == Guid.Empty)
            throw new ArgumentException("Category ID cannot be empty.", nameof(id));

        var category = await _categoryRepo.GetByIdAsync(id) ?? throw new KeyNotFoundException($"Category '{id}' not found.");

        if (category.IsDefault)
            throw new InvalidOperationException("Default categories cannot be deleted.");

        await _categoryRepo.DeleteAsync(category);
    }

    private static CategoryResponseDto MapToDto(Category c) => new(
        c.Id, c.Name, c.Color, c.IsDefault, c.CreatedAt
    );
}