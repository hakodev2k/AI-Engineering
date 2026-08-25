namespace SqlServerMcp;

public sealed record SqlServerOptions(
    string ConnectionString,
    int CommandTimeoutSeconds,
    int MaxRows,
    bool RequireWriteApproval,
    bool EnableProcedureExecute,
    string? ApprovalSecret)
{
    public static SqlServerOptions FromEnvironment()
    {
        var connectionString = Environment.GetEnvironmentVariable("SQLSERVER_CONNECTION_STRING");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("SQLSERVER_CONNECTION_STRING is required.");

        var timeout = ParseInt("SQLSERVER_COMMAND_TIMEOUT_SECONDS", 30, 1, 300);
        var maxRows = ParseInt("SQLSERVER_MAX_ROWS", 200, 1, 1000);
        var requireApproval = ParseBool("SQLSERVER_REQUIRE_WRITE_APPROVAL", true);
        var enableProcedureExecute = ParseBool("SQLSERVER_ENABLE_PROCEDURE_EXECUTE", false);
        var approvalSecret = Environment.GetEnvironmentVariable("SQLSERVER_APPROVAL_SECRET");

        if (requireApproval && string.IsNullOrWhiteSpace(approvalSecret))
            throw new InvalidOperationException("SQLSERVER_APPROVAL_SECRET is required when write approval is enabled.");

        return new SqlServerOptions(connectionString, timeout, maxRows, requireApproval, enableProcedureExecute, approvalSecret);
    }

    private static int ParseInt(string name, int fallback, int min, int max)
    {
        var raw = Environment.GetEnvironmentVariable(name);
        if (string.IsNullOrWhiteSpace(raw)) return fallback;
        if (!int.TryParse(raw, out var value) || value < min || value > max)
            throw new InvalidOperationException($"{name} must be an integer from {min} to {max}.");
        return value;
    }

    private static bool ParseBool(string name, bool fallback)
    {
        var raw = Environment.GetEnvironmentVariable(name);
        return string.IsNullOrWhiteSpace(raw) ? fallback : bool.Parse(raw);
    }
}
