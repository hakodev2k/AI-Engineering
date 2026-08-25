using System.Data;
using System.Text.Json;
using Microsoft.Data.SqlClient;

namespace SqlServerMcp;

public sealed class SqlServerClient(SqlServerOptions options)
{
    public async Task<Dictionary<string, object?>> HealthAsync(CancellationToken ct)
    {
        await using var connection = await OpenAsync(ct);
        await using var command = Command(connection, "SELECT DB_NAME() AS database_name, SUSER_SNAME() AS login_name, @@VERSION AS version");
        await using var reader = await command.ExecuteReaderAsync(ct);
        await reader.ReadAsync(ct);
        return Row(reader);
    }

    public Task<List<Dictionary<string, object?>>> DatabaseInfoAsync(CancellationToken ct) => QueryAsync(
        "SELECT DB_NAME() AS database_name, DATABASEPROPERTYEX(DB_NAME(),'Status') AS status, DATABASEPROPERTYEX(DB_NAME(),'Collation') AS collation, DATABASEPROPERTYEX(DB_NAME(),'Updateability') AS updateability", ct);

    public Task<List<Dictionary<string, object?>>> SchemasAsync(CancellationToken ct) => QueryAsync(
        "SELECT name AS schema_name FROM sys.schemas WHERE principal_id IS NOT NULL ORDER BY name", ct);

    public Task<List<Dictionary<string, object?>>> TablesAsync(string? schema, CancellationToken ct)
    {
        const string sql = "SELECT s.name AS schema_name, t.name AS table_name, t.temporal_type_desc, t.is_memory_optimized FROM sys.tables t JOIN sys.schemas s ON s.schema_id=t.schema_id WHERE (@schema IS NULL OR s.name=@schema) ORDER BY s.name,t.name";
        return QueryAsync(sql, ct, new SqlParameter("@schema", (object?)schema ?? DBNull.Value));
    }

    public Task<List<Dictionary<string, object?>>> ViewsAsync(string? schema, CancellationToken ct)
    {
        const string sql = "SELECT s.name AS schema_name, v.name AS view_name FROM sys.views v JOIN sys.schemas s ON s.schema_id=v.schema_id WHERE (@schema IS NULL OR s.name=@schema) ORDER BY s.name,v.name";
        return QueryAsync(sql, ct, new SqlParameter("@schema", (object?)schema ?? DBNull.Value));
    }

    public Task<List<Dictionary<string, object?>>> ProceduresAsync(string? schema, CancellationToken ct)
    {
        const string sql = "SELECT s.name AS schema_name, p.name AS procedure_name FROM sys.procedures p JOIN sys.schemas s ON s.schema_id=p.schema_id WHERE (@schema IS NULL OR s.name=@schema) ORDER BY s.name,p.name";
        return QueryAsync(sql, ct, new SqlParameter("@schema", (object?)schema ?? DBNull.Value));
    }

    public Task<List<Dictionary<string, object?>>> DescribeTableAsync(string schema, string table, CancellationToken ct)
    {
        const string sql = "SELECT c.column_id,c.name AS column_name,TYPE_NAME(c.user_type_id) AS data_type,c.max_length,c.precision,c.scale,c.is_nullable,c.is_identity,dc.definition AS default_definition FROM sys.columns c JOIN sys.tables t ON t.object_id=c.object_id JOIN sys.schemas s ON s.schema_id=t.schema_id LEFT JOIN sys.default_constraints dc ON dc.object_id=c.default_object_id WHERE s.name=@schema AND t.name=@table ORDER BY c.column_id";
        return QueryAsync(sql, ct, new SqlParameter("@schema", schema), new SqlParameter("@table", table));
    }

    public async Task<List<Dictionary<string, object?>>> ListRecordsAsync(string schema, string table, int limit, CancellationToken ct)
    {
        var take = Math.Clamp(limit, 1, options.MaxRows);
        var sql = $"SELECT TOP (@take) * FROM {SqlSafety.QuoteIdentifier(schema)}.{SqlSafety.QuoteIdentifier(table)}";
        return await QueryAsync(sql, ct, new SqlParameter("@take", take));
    }

    public async Task<List<Dictionary<string, object?>>> GetRecordAsync(string schema, string table, string keyColumn, JsonElement keyValue, CancellationToken ct)
    {
        var sql = $"SELECT TOP (2) * FROM {SqlSafety.QuoteIdentifier(schema)}.{SqlSafety.QuoteIdentifier(table)} WHERE {SqlSafety.QuoteIdentifier(keyColumn)}=@key";
        return await QueryAsync(sql, ct, new SqlParameter("@key", ToDbValue(keyValue)));
    }

    public async Task<List<Dictionary<string, object?>>> SelectAsync(string sql, IReadOnlyDictionary<string, JsonElement>? parameters, int limit, CancellationToken ct)
    {
        SqlSafety.EnsureReadOnlySelect(sql);
        var take = Math.Clamp(limit, 1, options.MaxRows);
        var wrapped = $"SELECT TOP (@__mcp_take) * FROM ({sql}) AS [mcp_query]";
        var sqlParams = new List<SqlParameter> { new("@__mcp_take", take) };
        if (parameters is not null)
            foreach (var pair in parameters)
                sqlParams.Add(new SqlParameter(NormalizeParameterName(pair.Key), ToDbValue(pair.Value)));
        return await QueryAsync(wrapped, ct, sqlParams.ToArray());
    }

    public async Task<int> InsertAsync(string schema, string table, IReadOnlyDictionary<string, JsonElement> fields, CancellationToken ct)
    {
        if (fields.Count is < 1 or > 100) throw new ArgumentException("fields must contain 1-100 entries.", nameof(fields));
        var columns = fields.Keys.Select(SqlSafety.QuoteIdentifier).ToArray();
        var names = fields.Keys.Select((_, i) => $"@p{i}").ToArray();
        var sql = $"INSERT INTO {SqlSafety.QuoteIdentifier(schema)}.{SqlSafety.QuoteIdentifier(table)} ({string.Join(',', columns)}) VALUES ({string.Join(',', names)})";
        var parameters = fields.Values.Select((v, i) => new SqlParameter(names[i], ToDbValue(v))).ToArray();
        return await ExecuteAsync(sql, ct, parameters);
    }

    public async Task<int> UpdateAsync(string schema, string table, string keyColumn, JsonElement keyValue, IReadOnlyDictionary<string, JsonElement> fields, CancellationToken ct)
    {
        if (fields.Count is < 1 or > 100) throw new ArgumentException("fields must contain 1-100 entries.", nameof(fields));
        if (fields.Keys.Any(k => string.Equals(k, keyColumn, StringComparison.OrdinalIgnoreCase)))
            throw new ArgumentException("The key column cannot also appear in fields.", nameof(fields));
        var assignments = fields.Keys.Select((k, i) => $"{SqlSafety.QuoteIdentifier(k)}=@p{i}").ToArray();
        var sql = $"UPDATE {SqlSafety.QuoteIdentifier(schema)}.{SqlSafety.QuoteIdentifier(table)} SET {string.Join(',', assignments)} WHERE {SqlSafety.QuoteIdentifier(keyColumn)}=@key";
        var parameters = fields.Values.Select((v, i) => new SqlParameter($"@p{i}", ToDbValue(v))).ToList();
        parameters.Add(new SqlParameter("@key", ToDbValue(keyValue)));
        return await ExecuteAsync(sql, ct, parameters.ToArray());
    }

    public async Task<List<Dictionary<string, object?>>> ExecuteProcedureAsync(string schema, string procedure, IReadOnlyDictionary<string, JsonElement>? parameters, CancellationToken ct)
    {
        if (!options.EnableProcedureExecute) throw new InvalidOperationException("Stored procedure execution is disabled. Set SQLSERVER_ENABLE_PROCEDURE_EXECUTE=true to enable it.");
        await using var connection = await OpenAsync(ct);
        await using var command = new SqlCommand($"{SqlSafety.QuoteIdentifier(schema)}.{SqlSafety.QuoteIdentifier(procedure)}", connection) { CommandType = CommandType.StoredProcedure, CommandTimeout = options.CommandTimeoutSeconds };
        if (parameters is not null)
            foreach (var pair in parameters)
                command.Parameters.Add(new SqlParameter(NormalizeParameterName(pair.Key), ToDbValue(pair.Value)));
        await using var reader = await command.ExecuteReaderAsync(ct);
        return await ReadRowsAsync(reader, options.MaxRows, ct);
    }

    private async Task<SqlConnection> OpenAsync(CancellationToken ct)
    {
        var connection = new SqlConnection(options.ConnectionString);
        try { await connection.OpenAsync(ct); return connection; }
        catch { await connection.DisposeAsync(); throw; }
    }

    private SqlCommand Command(SqlConnection connection, string sql) => new(sql, connection) { CommandTimeout = options.CommandTimeoutSeconds };

    private async Task<List<Dictionary<string, object?>>> QueryAsync(string sql, CancellationToken ct, params SqlParameter[] parameters)
    {
        await using var connection = await OpenAsync(ct);
        await using var command = Command(connection, sql);
        command.Parameters.AddRange(parameters);
        await using var reader = await command.ExecuteReaderAsync(ct);
        return await ReadRowsAsync(reader, options.MaxRows, ct);
    }

    private async Task<int> ExecuteAsync(string sql, CancellationToken ct, params SqlParameter[] parameters)
    {
        await using var connection = await OpenAsync(ct);
        await using var transaction = (SqlTransaction)await connection.BeginTransactionAsync(ct);
        await using var command = Command(connection, sql);
        command.Transaction = transaction;
        command.Parameters.AddRange(parameters);
        var affected = await command.ExecuteNonQueryAsync(ct);
        await transaction.CommitAsync(ct);
        return affected;
    }

    private static async Task<List<Dictionary<string, object?>>> ReadRowsAsync(SqlDataReader reader, int maxRows, CancellationToken ct)
    {
        var rows = new List<Dictionary<string, object?>>();
        while (rows.Count < maxRows && await reader.ReadAsync(ct)) rows.Add(Row(reader));
        return rows;
    }

    private static Dictionary<string, object?> Row(SqlDataReader reader)
    {
        var row = new Dictionary<string, object?>(reader.FieldCount, StringComparer.OrdinalIgnoreCase);
        for (var i = 0; i < reader.FieldCount; i++) row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
        return row;
    }

    private static string NormalizeParameterName(string name)
    {
        var clean = name.StartsWith('@') ? name[1..] : name;
        SqlSafety.QuoteIdentifier(clean);
        return "@" + clean;
    }

    internal static object ToDbValue(JsonElement value) => value.ValueKind switch
    {
        JsonValueKind.Null => DBNull.Value,
        JsonValueKind.String => value.TryGetDateTimeOffset(out var dto) ? dto : value.GetString()!,
        JsonValueKind.True => true,
        JsonValueKind.False => false,
        JsonValueKind.Number when value.TryGetInt64(out var l) => l,
        JsonValueKind.Number when value.TryGetDecimal(out var d) => d,
        JsonValueKind.Number => value.GetDouble(),
        _ => value.GetRawText()
    };
}
