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

function StartCommand {
    param (
        [string]$subCommand
    )

    switch ($subCommand.ToLower()) {
        "sql" {
            Write-Output "Starting database..."
            &docker compose -f $ComposeFile up -d expense-tracker-db
        }
        "api" {
            Write-Output "Starting API..."
            &docker compose -f $ComposeFile up -d --build expense-tracker-api
        }
        default {
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
