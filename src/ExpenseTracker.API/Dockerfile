FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /App

# Copy csproj and restore as distinct layers
COPY *.sln .
COPY src/ExpenseTracker.API/*.csproj ./src/ExpenseTracker.API/
COPY src/ExpenseTracker.Application/*.csproj ./src/ExpenseTracker.Application/
COPY src/ExpenseTracker.Domain/*.csproj ./src/ExpenseTracker.Domain/
COPY src/ExpenseTracker.Infrastructure/*.csproj ./src/ExpenseTracker.Infrastructure/
RUN dotnet build src/ExpenseTracker.API/ExpenseTracker.API.csproj -c Release -o /App/build

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /App
COPY --from=build /App/build .
ENTRYPOINT ["dotnet", "ExpenseTracker.API.dll"]