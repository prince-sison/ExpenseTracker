using ExpenseTracker.Application.DTOs.Categories;

namespace ExpenseTracker.Application.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponseDto>> GetCategoriesAsync();
    Task<CategoryResponseDto> CreateCategoryAsync(CreateCategoryDto dto);
    Task<CategoryResponseDto> UpdateCategoryAsync(UpdateCategoryDto dto);
    Task DeleteCategoryAsync(DeleteCategoryDto dto);
}