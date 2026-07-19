using ExpenseTracker.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(IDashboardService service) : ControllerBase
{
    private readonly IDashboardService _service = service;

    [HttpGet]
    public async Task<IActionResult> GetSummaryAsync(int month, int year)
        => Ok(await _service.GetSummaryAsync(month, year));
}