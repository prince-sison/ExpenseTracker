# Expense Tracker

A full-stack expense tracking app with a .NET (Clean Architecture) backend and a React + Vite frontend.

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (matching `global.json`, if present)
- [Node.js](https://nodejs.org/) (LTS)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the local SQL Server container)

## Local configuration

Some files hold local secrets and are intentionally **not** committed to version control. After cloning, you must create them yourself.

### Backend — `appsettings.Development.json`

Create `src/ExpenseTracker.API/appsettings.Development.json` (git-ignored). It holds the database connection string, including the SQL password:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1434;Database=ExpenseTracker;User Id=sa;Password=<your-local-password>;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

### Database container — `tools/SQL/.env`

Copy the example and set your own password (must match the one used in the connection string above):

```powershell
Copy-Item tools/SQL/.env.example tools/SQL/.env
```

### Frontend — `.env.local`

Copy the example and set the API base URL:

```powershell
Copy-Item frontend/.env.example frontend/.env.local
```

`frontend/.env.example` documents the required variable:

```
VITE_API_URL=http://localhost:8080
```

## Running the app

From the `tools/` folder, use the dev CLI (`dev.ps1`):

```powershell
cd tools

# Start SQL Server (Docker) and apply EF Core migrations
./dev.ps1 start sql

# Start the API
./dev.ps1 start api
```

Other commands: `./dev.ps1 stop sql|api`, `./dev.ps1 reset sql`.

Then start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

## Security note

Never commit `appsettings.Development.json`, `tools/SQL/.env`, or `frontend/.env.local`. These are excluded via `.gitignore`. If a secret is ever committed, rotate it — removing the file from tracking does not remove it from git history.
