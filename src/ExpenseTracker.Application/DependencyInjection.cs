using Microsoft.Extensions.DependencyInjection;
using ExpenseTracker.Application.Services.Interfaces;
using ExpenseTracker.Application.Services.Implementations;
using FluentValidation;
using ExpenseTracker.Application.Validators;

namespace ExpenseTracker.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IExpenseService, ExpenseService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IBudgetService, BudgetService>();

        services.AddValidatorsFromAssemblyContaining<CreateExpenseValidator>();

        return services;
    }
}