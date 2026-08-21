# .NET Backend Developer Engineering Rules

## MUST
- Trace every completed change to an explicit objective or acceptance criterion.
- Inspect nearby implementation and tests before introducing new patterns.
- Preserve public API compatibility unless a breaking change is explicitly approved.
- Validate untrusted input at the service boundary and enforce authorization independently of client behavior.
- Propagate `CancellationToken` through request-scoped I/O where the underlying API supports it.
- Use async APIs for I/O-bound work; keep synchronous CPU-bound work explicit.
- Keep secrets, tokens, credentials, connection strings, and sensitive payloads out of source code and logs.
- Parameterize SQL and use ORM/query APIs safely; never concatenate untrusted input into executable SQL.
- Review EF Core query shape, cardinality, tracking behavior, and round trips for non-trivial queries.
- Add or update automated tests for behavior changed by the task when practical.
- Run relevant build/tests and inspect the final diff before declaring completion.
- Distinguish facts, assumptions, hypotheses, risks, and decisions in investigations and handoffs.
- Make retries bounded and pair them with timeout, idempotency, and failure semantics.
- Record remaining risks when complete verification is impossible.

## MUST NOT
- Do not mark work complete because code compiles or an artifact exists; verification evidence is required.
- Do not swallow exceptions without preserving useful context or an intentional recovery path.
- Do not use `.Result`, `.Wait()`, or synchronous blocking around asynchronous request-path I/O without a documented reason.
- Do not introduce microservices, queues, caches, CQRS, event sourcing, or extra abstraction merely because they are available.
- Do not log credentials, authorization headers, raw access tokens, private keys, or unnecessary personal data.
- Do not change production data, deploy to production, rotate secrets, destroy infrastructure, or execute destructive SQL without explicit human approval.
- Do not rewrite Git history or force-push unless explicitly approved.
- Do not change a database schema destructively in the same step that removes all backward compatibility unless a reviewed rollout makes it safe.
- Do not retry indefinitely.
- Do not present a hypothesis as confirmed root cause.
- Do not add a dependency without checking whether existing platform/library capabilities solve the problem sufficiently.
- Do not weaken authentication, authorization, validation, TLS, audit, or other security controls to make a failing scenario pass.

## SHOULD
- Prefer a modular monolith and existing application boundaries until distribution is justified by independent scaling, ownership, reliability, or deployment requirements.
- Prefer explicit, readable code over generalized abstractions with only one use case.
- Use immutable/read-only data shapes for query results when mutation is not required.
- Use `AsNoTracking()` and projections for EF Core read paths where appropriate.
- Keep transactions short and centered on a single consistency boundary.
- Use structured logging with stable event names and correlation identifiers.
- Prefer deterministic validation and scripts for deterministic checks.
- Optimize only after measuring a relevant metric under representative conditions.
- Make background jobs idempotent or otherwise duplicate-safe.
- Design external integration calls with timeout, cancellation, retry classification, observability, and fallback behavior.
- Escalate early when requirement ambiguity can cause data loss, security exposure, contract breakage, or substantial rework.
