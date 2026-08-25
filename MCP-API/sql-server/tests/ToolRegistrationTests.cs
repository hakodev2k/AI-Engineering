using System.Reflection;
using ModelContextProtocol.Server;
using SqlServerMcp;

namespace SqlServerMcp.Tests;

public sealed class ToolRegistrationTests
{
    [Fact]
    public void ExpectedToolsAreRegisteredWithStableProviderScopedNames()
    {
        var names = typeof(SqlServerTools).GetMethods(BindingFlags.Public | BindingFlags.Static)
            .Select(m => m.GetCustomAttribute<McpServerToolAttribute>()?.Name)
            .Where(n => n is not null)
            .Cast<string>()
            .OrderBy(n => n, StringComparer.Ordinal)
            .ToArray();

        var expected = new[]
        {
            "sql-server.database.health",
            "sql-server.database.info",
            "sql-server.procedure.execute",
            "sql-server.procedure.list",
            "sql-server.query.select",
            "sql-server.record.get",
            "sql-server.record.insert",
            "sql-server.record.list",
            "sql-server.record.update",
            "sql-server.schema.list",
            "sql-server.table.describe",
            "sql-server.table.list",
            "sql-server.view.list"
        };

        Assert.Equal(expected, names);
    }

    [Fact]
    public void ReadToolsDeclareReadOnlyAndNonDestructiveAnnotations()
    {
        foreach (var method in typeof(SqlServerTools).GetMethods(BindingFlags.Public | BindingFlags.Static))
        {
            var attribute = method.GetCustomAttribute<McpServerToolAttribute>();
            if (attribute?.Name is null || !attribute.Name.StartsWith("sql-server.", StringComparison.Ordinal)) continue;
            if (attribute.Name is "sql-server.record.insert" or "sql-server.record.update" or "sql-server.procedure.execute") continue;
            Assert.True(attribute.ReadOnly);
            Assert.False(attribute.Destructive);
        }
    }

    [Fact]
    public void ProcedureExecutionIsMarkedPotentiallyDestructive()
    {
        var method = typeof(SqlServerTools).GetMethods(BindingFlags.Public | BindingFlags.Static)
            .Single(m => m.GetCustomAttribute<McpServerToolAttribute>()?.Name == "sql-server.procedure.execute");
        var attribute = method.GetCustomAttribute<McpServerToolAttribute>()!;
        Assert.False(attribute.ReadOnly);
        Assert.True(attribute.Destructive);
    }
}
