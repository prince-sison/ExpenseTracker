#!/usr/bin/env pwsh
<#
.SYNOPSIS
ExpenseTracker Dev CLI Tool

.DESCRIPTION
Streamlined CLI tool to manage the local ExpenseTracker stack via Docker Compose.
Commands: start, stop, reset, logs, help.
#>

# Resolve the compose file relative to this script so it works from any cwd.
$ComposeFile = Join-Path $PSScriptRoot "SQL\docker-compose.yml"

# Repository root (one level up from the tools folder that hosts this script).
$RepoRoot = Split-Path -Parent $PSScriptRoot

function WaitForDbHealthy {
    param (
        [string]$containerName = "expense-tracker-db",
        [int]$timeoutSeconds = 120
    )

    Write-Output "Waiting for '$containerName' to be healthy..."
    $elapsed = 0
    while ($elapsed -lt $timeoutSeconds) {
        $status = (&docker inspect -f "{{.State.Health.Status}}" $containerName 2>$null)
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Container '$containerName' was not found. Did it start?"
            return $false
        }

        if ($status -eq "healthy") {
            Write-Output "Database is healthy."
            return $true
        }

        Start-Sleep -Seconds 3
        $elapsed += 3
    }

    Write-Error "Timed out after $timeoutSeconds seconds waiting for '$containerName' to become healthy."
    return $false
}

function ApplyMigrations {
    Write-Output "Applying EF Core migrations..."

    # The migration runs on the host, so it must reach the DB via the published
    # host port (localhost) rather than the compose service name. Query the
    # container for the actual published port so this stays correct even when a
    # non-default DB_HOST_PORT was used to create it.
    $portMapping = (&docker port expense-tracker-db 1433 2>$null | Select-Object -First 1)
    if ($portMapping -match ':(\d+)\s*$') {
        $dbPort = $Matches[1]
    } elseif ($env:DB_HOST_PORT) {
        $dbPort = $env:DB_HOST_PORT
    } else {
        $dbPort = "1433"
    }
    $dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "ExpenseTracker" }
    $dbUser = if ($env:DB_ADMIN_USER) { $env:DB_ADMIN_USER } else { "sa" }
    $dbPassword = if ($env:DB_ADMIN_PASSWORD) { $env:DB_ADMIN_PASSWORD } else { "MyStrongPassword123@" }

    $env:ConnectionStrings__DefaultConnection = "Server=localhost,$dbPort;Database=$dbName;User Id=$dbUser;Password=$dbPassword;TrustServerCertificate=True;MultipleActiveResultSets=true"

    &dotnet ef database update -p (Join-Path $RepoRoot "src/ExpenseTracker.Infrastructure") -s (Join-Path $RepoRoot "src/ExpenseTracker.API")
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Migration failed (dotnet ef exited with code $LASTEXITCODE)."
        return $false
    }
    Write-Output "Migrations applied successfully."
    return $true
}

# Start the database, wait for it to be healthy, then apply EF Core migrations.
function EnsureDbReady {
    Write-Output "Starting database..."
    &docker compose -f $ComposeFile up -d expense-tracker-db

    if (-not (WaitForDbHealthy)) {
        return $false
    }

    return (ApplyMigrations)
}

function StartCommand {
    param (
        [string]$subCommand
    )

    switch ($subCommand.ToLower()) {
        "sql" {
            if (-not (EnsureDbReady)) {
                exit 1
            }
        }
        "api" {
            # Ensure the database is up, healthy, and migrated before the API starts.
            if (-not (EnsureDbReady)) {
                exit 1
            }

            Write-Output "Starting API..."
            &docker compose -f $ComposeFile up -d --build expense-tracker-api
        }
        default {
            # Ensure the database is up, healthy, and migrated before the API starts.
            if (-not (EnsureDbReady)) {
                exit 1
            }

            Write-Output "Starting all services (db + api)..."
            &docker compose -f $ComposeFile up -d --build
        }
    }
}

function StopCommand {
    param (
        [string]$subCommand
    )

    switch ($subCommand.ToLower()) {
        "sql" {
            Write-Output "Stopping database..."
            &docker compose -f $ComposeFile stop expense-tracker-db
        }
        "api" {
            Write-Output "Stopping API..."
            &docker compose -f $ComposeFile stop expense-tracker-api
        }
        default {
            Write-Output "Stopping all services..."
            &docker compose -f $ComposeFile down
        }
    }
}

function ResetCommand {
    param (
        [string]$subCommand
    )

    switch ($subCommand.ToLower()) {
        "sql" {
            Write-Output "Resetting database (removing data volume)..."
            &docker compose -f $ComposeFile rm -s -f -v expense-tracker-db
            &docker volume rm expense-tracker-sql_mssql-data -f
        }
        "api" {
            Write-Output "Resetting API (removing container)..."
            &docker compose -f $ComposeFile rm -s -f -v expense-tracker-api
        }
        default {
            Write-Output "Resetting all containers and volumes..."
            &docker compose -f $ComposeFile down -v
        }
    }
}

function LogsCommand {
    param (
        [string]$serviceName
    )

    if ($null -ne $serviceName -and "" -ne $serviceName) {
        Write-Output "Showing logs for $serviceName..."
        &docker compose -f $ComposeFile logs -f $serviceName
    } else {
        Write-Output "Showing all logs..."
        &docker compose -f $ComposeFile logs -f
    }
}

function Help {
    Write-Host "Usage:"
    Write-Host "  ./dev.ps1 <command> [sub-command]"
    Write-Host ""
    Write-Host "Available commands:"
    Write-Host "  start [sub-command]"
    Write-Host "    sql              - Start only the database container"
    Write-Host "    api              - Start (build) only the API container"
    Write-Host "    [no sub-command] - Start all services (db + api)"
    Write-Host ""
    Write-Host "  stop [sub-command]"
    Write-Host "    sql              - Stop the database container"
    Write-Host "    api              - Stop the API container"
    Write-Host "    [no sub-command] - Stop all services (compose down)"
    Write-Host ""
    Write-Host "  reset [sub-command]"
    Write-Host "    sql              - Reset the database (remove container + data volume)"
    Write-Host "    api              - Reset the API (remove container)"
    Write-Host "    [no sub-command] - Reset all containers and volumes"
    Write-Host ""
    Write-Host "  logs [serviceName] - Follow logs for all or a specific service"
    Write-Host "  help               - Show this help message"
}

# Entry point
if ($args.Count -lt 1) {
    Write-Host "No command provided."
    Help
    exit 1
}

$Command = $args[0].ToLower()
$SubCommand = if ($args.Count -ge 2) { $args[1] } else { $null }

switch ($Command) {
    "start" { StartCommand $SubCommand }
    "stop"  { StopCommand $SubCommand }
    "reset" { ResetCommand $SubCommand }
    "logs"  { LogsCommand $SubCommand }
    "help"  { Help }
    default {
        Write-Host "Unknown command: $Command"
        Help
    }
}
