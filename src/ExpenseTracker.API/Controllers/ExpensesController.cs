using ExpenseTracker.Application.DTOs.Expenses;
using ExpenseTracker.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController(IExpenseService service) : ControllerBase
{
    private readonly IExpenseService _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int month, [FromQuery] int year, [FromQuery] Guid? categoryId)
        => Ok(await _service.GetExpensesAsync(month, year, categoryId));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var expense = await _service.GetExpenseByIdAsync(id);
        return expense is null ? NotFound(new { error = "Expense not found." }) : Ok(expense);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateExpenseDto dto)
    {
        var created = await _service.CreateExpenseAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateExpenseDto dto)
        => Ok(await _service.UpdateExpenseAsync(id, dto));

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteExpenseAsync(id);
        return NoContent();
    }
}