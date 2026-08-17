using ExpenseTracker.Application.DTOs.Categories;
using ExpenseTracker.Application.Services.Implementations;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Repositories;
using FluentValidation;
using FluentValidation.Results;
using NSubstitute;
using NSubstitute.ExceptionExtensions;

namespace ExpenseTracker.Application.Tests.Services;

public class CategoryServiceTests
{
    private readonly ICategoryRepository _categoryRepo = Substitute.For<ICategoryRepository>();
    private readonly IValidator<CreateCategoryDto> _createValidator = Substitute.For<IValidator<CreateCategoryDto>>();
    private readonly IValidator<UpdateCategoryDto> _updateValidator = Substitute.For<IValidator<UpdateCategoryDto>>();

    public CategoryServiceTests()
    {
        _createValidator.ValidateAsync(Arg.Any<IValidationContext>(), Arg.Any<CancellationToken>())
            .Returns(Task.FromResult(new ValidationResult()));
        _updateValidator.ValidateAsync(Arg.Any<IValidationContext>(), Arg.Any<CancellationToken>())
            .Returns(Task.FromResult(new ValidationResult()));
    }

    private CategoryService CreateSut() =>
        new(_categoryRepo, _createValidator, _updateValidator);

    // ---------- GetCategoriesAsync ----------

    [Fact]
    public async Task GetCategoriesAsync_ReturnsMappedCategories()
    {
        var categories = new List<Category>
        {
            Category.Create("Food", "#111"),
            Category.Create("Travel", "#222"),
        };
        _categoryRepo.GetAllAsync().Returns(categories);

        var result = (await CreateSut().GetCategoriesAsync()).ToList();

        Assert.Equal(2, result.Count);
        Assert.Equal("Food", result[0].Name);
        Assert.Equal("Travel", result[1].Name);
    }

    // ---------- CreateCategoryAsync ----------

    [Fact]
    public async Task CreateCategoryAsync_CreatesAndReturnsDto_WhenNameAvailable()
    {
        var dto = new CreateCategoryDto("Food", "#fff");
        _categoryRepo.ExistsByNameAsync("Food").Returns(false);

        var result = await CreateSut().CreateCategoryAsync(dto);

        Assert.Equal("Food", result.Name);
        Assert.Equal("#fff", result.Color);
        await _categoryRepo.Received(1).AddAsync(Arg.Any<Category>());
    }

    [Fact]
    public async Task CreateCategoryAsync_ThrowsInvalidOperation_WhenNameExists()
    {
        var dto = new CreateCategoryDto("Food", "#fff");
        _categoryRepo.ExistsByNameAsync("Food").Returns(true);

        await Assert.ThrowsAsync<InvalidOperationException>(() => CreateSut().CreateCategoryAsync(dto));
        await _categoryRepo.DidNotReceive().AddAsync(Arg.Any<Category>());
    }

    [Fact]
    public async Task CreateCategoryAsync_ThrowsValidation_WhenInvalid()
    {
        var dto = new CreateCategoryDto("", "");
        _createValidator.ValidateAsync(Arg.Any<IValidationContext>(), Arg.Any<CancellationToken>())
            .Throws(new ValidationException("Invalid category."));

        await Assert.ThrowsAsync<ValidationException>(() => CreateSut().CreateCategoryAsync(dto));
        await _categoryRepo.DidNotReceive().ExistsByNameAsync(Arg.Any<string>());
    }

    // ---------- UpdateCategoryAsync ----------

    [Fact]
    public async Task UpdateCategoryAsync_UpdatesAndReturnsDto_WhenFound()
    {
        var id = Guid.NewGuid();
        var existing = Category.Create("Old", "#000");
        _categoryRepo.GetByIdAsync(id).Returns(existing);
        var dto = new UpdateCategoryDto(id, "New", "#abc");

        var result = await CreateSut().UpdateCategoryAsync(dto);

        Assert.Equal("New", result.Name);
        Assert.Equal("#abc", result.Color);
        await _categoryRepo.Received(1).UpdateAsync(existing);
    }

    [Fact]
    public async Task UpdateCategoryAsync_ThrowsKeyNotFound_WhenMissing()
    {
        var id = Guid.NewGuid();
        _categoryRepo.GetByIdAsync(id).Returns((Category?)null);
        var dto = new UpdateCategoryDto(id, "New", "#abc");

        await Assert.ThrowsAsync<KeyNotFoundException>(() => CreateSut().UpdateCategoryAsync(dto));
        await _categoryRepo.DidNotReceive().UpdateAsync(Arg.Any<Category>());
    }

    // ---------- DeleteCategoryAsync ----------

    [Fact]
    public async Task DeleteCategoryAsync_ThrowsArgument_WhenIdEmpty()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => CreateSut().DeleteCategoryAsync(Guid.Empty));
    }

    [Fact]
    public async Task DeleteCategoryAsync_ThrowsKeyNotFound_WhenMissing()
    {
        var id = Guid.NewGuid();
        _categoryRepo.GetByIdAsync(id).Returns((Category?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => CreateSut().DeleteCategoryAsync(id));
    }

    [Fact]
    public async Task DeleteCategoryAsync_ThrowsInvalidOperation_WhenDefault()
    {
        var id = Guid.NewGuid();
        _categoryRepo.GetByIdAsync(id).Returns(Category.Create("System", "#000", isDefault: true));

        await Assert.ThrowsAsync<InvalidOperationException>(() => CreateSut().DeleteCategoryAsync(id));
        await _categoryRepo.DidNotReceive().DeleteAsync(Arg.Any<Category>());
    }

    [Fact]
    public async Task DeleteCategoryAsync_Deletes_WhenFoundAndNotDefault()
    {
        var id = Guid.NewGuid();
        var category = Category.Create("Food", "#fff");
        _categoryRepo.GetByIdAsync(id).Returns(category);

        await CreateSut().DeleteCategoryAsync(id);

        await _categoryRepo.Received(1).DeleteAsync(category);
    }
}
