FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /App

# Copy csproj files and restore as distinct layers
COPY src/ExpenseTracker.API/*.csproj ./src/ExpenseTracker.API/
COPY src/ExpenseTracker.Application/*.csproj ./src/ExpenseTracker.Application/
COPY src/ExpenseTracker.Domain/*.csproj ./src/ExpenseTracker.Domain/
COPY src/ExpenseTracker.Infrastructure/*.csproj ./src/ExpenseTracker.Infrastructure/
RUN dotnet restore src/ExpenseTracker.API/ExpenseTracker.API.csproj

# Copy the source and publish
COPY src/ ./src/
RUN dotnet publish src/ExpenseTracker.API/ExpenseTracker.API.csproj -c Release -o /App/publish --no-restore

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /App
COPY --from=build /App/publish .
ENTRYPOINT ["dotnet", "ExpenseTracker.API.dll"]
