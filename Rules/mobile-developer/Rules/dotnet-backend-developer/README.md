# .NET Backend Developer Rules

Operating constraints for AI-assisted work performed in the .NET Backend Developer discipline. These files are policy guidance, require no installation, and should be combined with repository-specific instructions and deterministic checks.

Each rule file is self-contained and may be copied independently; this README and the sibling rules are navigation and optional context, not runtime dependencies.

## Usage

1. Select the smallest set of rules that covers the planned change.
2. Resolve conflicts using repository policy, explicit approval boundaries, and the stricter safety requirement.
3. Where available, optionally pair the rules with matching .NET backend procedures.
4. Convert critical requirements into tests, hooks, or CI checks in the target repository.

## Catalogue

- [API Contract Rules](api-contract-rules.md)
- [Architecture Boundary Rules](architecture-boundary-rules.md)
- [ASP.NET Core Rules](aspnet-core-rules.md)
- [Async and Concurrency Rules](async-concurrency-rules.md)
- [Authentication Rules](authentication-rules.md)
- [Authorization Rules](authorization-rules.md)
- [Background Processing Rules](background-processing-rules.md)
- [Caching Rules](caching-rules.md)
- [Code Review Rules](code-review-rules.md)
- [C# Quality Rules](csharp-quality-rules.md)
- [Database Query Rules](database-query-rules.md)
- [Dependency Rules](dependency-rules.md)
- [.NET Runtime Rules](dotnet-runtime-rules.md)
- [EF Core Rules](ef-core-rules.md)
- [Exception Handling Rules](exception-handling-rules.md)
- [Logging Rules](logging-rules.md)
- [Migration Safety Rules](migration-safety-rules.md)
- [Observability Rules](observability-rules.md)
- [Performance Rules](performance-rules.md)
- [Production Safety Rules](production-safety-rules.md)
- [Security Rules](security-rules.md)
- [Testing Rules](testing-rules.md)
- [Transaction Rules](transaction-rules.md)

## Maintenance

When adding a rule, keep it focused, link it from this index, preserve the surrounding terminology, and document verification and approval boundaries. Follow the host repository's contribution policy when one exists.
