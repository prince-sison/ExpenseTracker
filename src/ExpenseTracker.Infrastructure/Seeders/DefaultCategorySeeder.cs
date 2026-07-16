using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Infrastructure.Seeders;

public static class DefaultCategorySeeder
{
    private static readonly (string Name, string Color)[] DefaultCategories =
    [
        ("Food", "#F87171"),
        ("Transport", "#60A5FA"),
        ("Utilities", "#FBBF24"),
        ("Health", "#34D399"),
        ("Entertainment", "#A78BFA"),
        ("Other", "#9CA3AF")
    ];

    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Categories.AnyAsync(c => c.IsDefault)) return;

        foreach (var (name, color) in DefaultCategories)
            context.Categories.Add(Category.Create(name, color, isDefault: true));

        await context.SaveChangesAsync();
    }
}