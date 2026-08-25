using System.Security.Cryptography;
using System.Text;

namespace SqlServerMcp;

public enum ToolRisk { Read, Write, HighRisk, Destructive }

public sealed class ApprovalPolicy(SqlServerOptions options)
{
    public void Demand(string toolName, string? approvalToken, ToolRisk risk)
    {
        if (risk == ToolRisk.Read) return;
        if (risk == ToolRisk.Destructive) throw new InvalidOperationException($"{toolName} is disabled by policy.");
        if (!options.RequireWriteApproval && risk == ToolRisk.Write) return;
        if (string.IsNullOrWhiteSpace(options.ApprovalSecret) || string.IsNullOrWhiteSpace(approvalToken))
            throw new UnauthorizedAccessException($"{toolName} requires explicit human approval.");

        var expected = Convert.ToHexString(HMACSHA256.HashData(
            Encoding.UTF8.GetBytes(options.ApprovalSecret),
            Encoding.UTF8.GetBytes(toolName))).ToLowerInvariant();
        var a = Encoding.UTF8.GetBytes(expected);
        var b = Encoding.UTF8.GetBytes(approvalToken.Trim().ToLowerInvariant());
        if (a.Length != b.Length || !CryptographicOperations.FixedTimeEquals(a, b))
            throw new UnauthorizedAccessException($"Invalid approval token for {toolName}.");
    }

    public string CreateOperatorApprovalToken(string toolName)
    {
        if (string.IsNullOrWhiteSpace(options.ApprovalSecret))
            throw new InvalidOperationException("Approval secret is not configured.");
        return Convert.ToHexString(HMACSHA256.HashData(
            Encoding.UTF8.GetBytes(options.ApprovalSecret),
            Encoding.UTF8.GetBytes(toolName))).ToLowerInvariant();
    }
}
