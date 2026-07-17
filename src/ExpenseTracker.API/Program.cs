using ExpenseTracker.Application;
using ExpenseTracker.Infrastructure;
using ExpenseTracker.Infrastructure.Persistence;
using ExpenseTracker.Infrastructure.Seeders;
using ExpenseTracker.API.Middlewares;

// API/Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()));

builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Seed default categories on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DefaultCategorySeeder.SeedAsync(db);
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowFrontend");
app.UseMiddleware<GlobalExceptionMiddleware>();
app.MapControllers();
app.Run();