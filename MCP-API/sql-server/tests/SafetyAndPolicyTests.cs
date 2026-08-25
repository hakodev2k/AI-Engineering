using System.Security.Cryptography;
using System.Text;
using SqlServerMcp;

namespace SqlServerMcp.Tests;

public sealed class SafetyAndPolicyTests
{
    [Theory]
    [InlineData("dbo")]
    [InlineData("Orders_2026")]
    [InlineData("#temp")]
    public void QuoteIdentifier_AllowsSafeSqlServerIdentifiers(string input)
    {
        var result = SqlSafety.QuoteIdentifier(input);
        Assert.StartsWith("[", result, StringComparison.Ordinal);
        Assert.EndsWith("]", result, StringComparison.Ordinal);
    }

    [Theory]
    [InlineData("dbo.Users")]
    [InlineData("users;drop table x")]
    [InlineData("")]
    [InlineData("name with spaces")]
    public void QuoteIdentifier_RejectsAmbiguousIdentifiers(string input) =>
        Assert.Throws<ArgumentException>(() => SqlSafety.QuoteIdentifier(input));

    [Theory]
    [InlineData("SELECT * FROM dbo.Users WHERE Id=@id")]
    [InlineData("WITH x AS (SELECT 1 AS n) SELECT n FROM x")]
    public void ReadOnlyGuard_AllowsSingleSelect(string sql) => SqlSafety.EnsureReadOnlySelect(sql);

    [Theory]
    [InlineData("DELETE FROM dbo.Users")]
    [InlineData("SELECT * INTO dbo.Copy FROM dbo.Users")]
    [InlineData("SELECT * FROM dbo.Users; DROP TABLE dbo.Users")]
    [InlineData("EXEC dbo.DoWork")]
    [InlineData("SELECT * FROM OPENROWSET('x','y','z')")]
    public void ReadOnlyGuard_RejectsMutationOrExternalAccess(string sql) =>
        Assert.Throws<ArgumentException>(() => SqlSafety.EnsureReadOnlySelect(sql));

    [Fact]
    public void WritePolicy_RequiresValidOutOfBandApproval()
    {
        const string secret = "unit-test-secret";
        const string tool = "sql-server.record.insert";
        var options = new SqlServerOptions("Server=unused", 30, 100, true, false, secret);
        var policy = new ApprovalPolicy(options);

        Assert.Throws<UnauthorizedAccessException>(() => policy.Demand(tool, null, ToolRisk.Write));
        Assert.Throws<UnauthorizedAccessException>(() => policy.Demand(tool, "wrong", ToolRisk.Write));

        var token = Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), Encoding.UTF8.GetBytes(tool))).ToLowerInvariant();
        policy.Demand(tool, token, ToolRisk.Write);
    }

    [Fact]
    public void ReadPolicy_DoesNotRequireApproval()
    {
        var options = new SqlServerOptions("Server=unused", 30, 100, true, false, null);
        var policy = new ApprovalPolicy(options);
        policy.Demand("sql-server.table.list", null, ToolRisk.Read);
    }

    [Fact]
    public void HighRiskPolicy_RequiresApprovalEvenWhenWriteApprovalDisabled()
    {
        var options = new SqlServerOptions("Server=unused", 30, 100, false, true, null);
        var policy = new ApprovalPolicy(options);
        Assert.Throws<UnauthorizedAccessException>(() => policy.Demand("sql-server.procedure.execute", null, ToolRisk.HighRisk));
    }

    [Fact]
    public void DestructivePolicy_IsDisabled()
    {
        var options = new SqlServerOptions("Server=unused", 30, 100, false, false, null);
        var policy = new ApprovalPolicy(options);
        Assert.Throws<InvalidOperationException>(() => policy.Demand("sql-server.any.delete", null, ToolRisk.Destructive));
    }
}
