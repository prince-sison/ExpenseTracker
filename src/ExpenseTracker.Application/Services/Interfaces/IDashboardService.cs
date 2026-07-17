using ExpenseTracker.Application.DTOs.Dashboard;

namespace ExpenseTracker.Application.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(int month, int year);
}