using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// === Database: SQLite by default, PostgreSQL when configured ===
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=ezcondo.db";
var databaseProvider = builder.Configuration["Database:Provider"]
    ?? (connectionString.Contains("Host=", StringComparison.OrdinalIgnoreCase)
        || connectionString.Contains("Username=", StringComparison.OrdinalIgnoreCase)
        ? "PostgreSQL"
        : "SQLite");

builder.Services.AddDbContext<EZCondoDbContext>(options =>
{
    if (databaseProvider.Equals("PostgreSQL", StringComparison.OrdinalIgnoreCase)
        || databaseProvider.Equals("Postgres", StringComparison.OrdinalIgnoreCase))
    {
        options.UseNpgsql(connectionString);
    }
    else if (databaseProvider.Equals("SQLite", StringComparison.OrdinalIgnoreCase))
    {
        options.UseSqlite(connectionString);
    }
    else
    {
        throw new InvalidOperationException(
            $"Unsupported database provider '{databaseProvider}'. Use SQLite or PostgreSQL.");
    }
});

// === JSON serialization: handle cycles & Vietnamese characters ===
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
    });

// === CORS: Allow frontend (Vite) to call backend ===
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// === Swagger / OpenAPI (Swashbuckle) ===
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "EZCondo API", Version = "v1", Description = "Backend API cho hệ thống quản lý chung cư EZCondo" });
});

var app = builder.Build();

// === Auto-migrate & seed database on startup ===
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EZCondoDbContext>();
    db.Database.EnsureCreated();
    await SeedData.Initialize(db);
}

// === Middleware pipeline ===
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "EZCondo API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

Console.WriteLine("========================================");
Console.WriteLine("  EZCondo Backend API - C# ASP.NET Core");
Console.WriteLine("========================================");
Console.WriteLine($"  API:     http://localhost:5263/api");
Console.WriteLine($"  Swagger: http://localhost:5263/swagger");
Console.WriteLine("========================================");

app.Run();
