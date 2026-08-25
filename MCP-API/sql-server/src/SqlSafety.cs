using System.Text.RegularExpressions;

namespace SqlServerMcp;

public static partial class SqlSafety
{
    [GeneratedRegex("^[A-Za-z_][A-Za-z0-9_@$#]{0,127}$", RegexOptions.CultureInvariant)]
    private static partial Regex IdentifierRegex();

    [GeneratedRegex(@"\b(insert|update|delete|merge|alter|drop|create|truncate|grant|revoke|deny|backup|restore|dbcc|waitfor|exec(?:ute)?|openrowset|openquery|opendatasource|into)\b", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex MutatingKeywordRegex();

    public static string QuoteIdentifier(string value)
    {
        if (string.IsNullOrWhiteSpace(value) || !IdentifierRegex().IsMatch(value))
            throw new ArgumentException("Invalid SQL Server identifier.", nameof(value));
        return $"[{value.Replace("]", "]]", StringComparison.Ordinal)}]";
    }

    public static void EnsureReadOnlySelect(string sql)
    {
        if (string.IsNullOrWhiteSpace(sql)) throw new ArgumentException("SQL is required.", nameof(sql));
        var trimmed = sql.Trim();
        if (trimmed.Contains(';', StringComparison.Ordinal))
            throw new ArgumentException("Only one statement is allowed; semicolons are rejected.", nameof(sql));
        if (!(trimmed.StartsWith("select", StringComparison.OrdinalIgnoreCase) || trimmed.StartsWith("with", StringComparison.OrdinalIgnoreCase)))
            throw new ArgumentException("Only SELECT or WITH...SELECT statements are allowed.", nameof(sql));
        if (MutatingKeywordRegex().IsMatch(trimmed))
            throw new ArgumentException("Potentially mutating or external-access SQL is rejected.", nameof(sql));
    }
}
