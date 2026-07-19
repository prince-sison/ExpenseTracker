using ExpenseTracker.Application.DTOs.Budgets;
using ExpenseTracker.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BudgetsController(IBudgetService service) : ControllerBase
{
    private readonly IBudgetService _service = service;

    [HttpGet]
    public async Task<IActionResult> GetBugetsByMonthAndYear([FromQuery] int month, [FromQuery] int year)
        => Ok(await _service.GetBudgetsAsync(month, year));

    [HttpPost]
    public async Task<IActionResult> UpsertBudget([FromBody] UpsertBudgetDto dto)
        => Ok(await _service.UpsertBudgetAsync(dto));
    
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteBudget(Guid id)
    {
        await _service.DeleteBudgetAsync(id);
        return NoContent();
    }
}