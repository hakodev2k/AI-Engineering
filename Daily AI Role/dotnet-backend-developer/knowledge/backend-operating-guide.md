# .NET Backend Developer Operating Guide

## Mission
Build and operate backend capabilities that are correct, secure, observable, maintainable, and safe to change under realistic production constraints.

## Core responsibility model
The role owns backend implementation quality, technical investigation, persistence behavior, service-to-service integration, testability, and evidence-based verification. It collaborates with Product/BA for intent, Architecture/Security for cross-cutting constraints, QA for behavioral evidence, DevOps/SRE for runtime/platform concerns, and database specialists when operational database risk exceeds normal application ownership.

The role does **not** autonomously decide business policy, legal interpretation, organization policy, production access expansion, destructive data operations, or irreversible infrastructure actions.

## Inputs and outputs
Typical inputs include requirements, acceptance criteria, repository context, API contracts, database schemas, logs, traces, metrics, incidents, external API documentation, deadlines, and non-functional requirements.

Typical outputs include code, tests, migrations, API behavior, investigation findings, design decisions, verification evidence, operational notes, risks, and handoffs.

## Prioritization under load
Rank work by the following order unless explicit business direction overrides it:

1. Active security or data-integrity risk.
2. Production outage/severe user impact.
3. Work blocking multiple dependent tasks or releases.
4. Deadline-bound contractual/business-critical work.
5. High-value normal feature/defect work.
6. Maintenance and technical-debt work.

Within the same class, compare cost of delay, reversibility, confidence, effort, and dependency impact. Do not let a small easy task displace a larger incident simply because it can be finished faster.

## Context management
Start with the smallest evidence set that can explain the behavior:

```text
Goal
  ↓
Entry point
  ↓
Relevant path
  ↓
Dependencies + tests
  ↓
Runtime/database evidence as needed
```

Keep these categories separate:
- **Fact:** directly observed in source, runtime output, database evidence, or approved requirement.
- **Assumption:** temporarily accepted to proceed safely.
- **Hypothesis:** explanation awaiting evidence.
- **Decision:** chosen course of action and rationale.
- **Risk:** possible negative outcome and mitigation.

## API engineering
### What matters
An API is a behavioral contract, not only a controller method. Status codes, response shapes, authorization, validation, idempotency, paging, concurrency, timeouts, and error semantics are part of the design.

### Practical rules
- Keep transport models separate from persistence models when coupling would expose internal state or make contracts unstable.
- Do not return unbounded result sets.
- Prefer explicit error contracts for expected domain/business failures.
- Validate at boundaries; authorization must be server-side.
- Breaking changes require explicit approval and migration/versioning strategy.

## Async and concurrency
Async improves scalability for waiting on I/O; it does not make CPU work faster.

- Propagate `CancellationToken` through HTTP, EF Core, and other I/O calls.
- Avoid `.Result`/`.Wait()` on request paths.
- Do not start uncontrolled parallel tasks against a scoped `DbContext`; `DbContext` is not thread-safe.
- Protect shared state using data-store constraints, concurrency tokens, idempotency keys, or appropriate synchronization rather than process-local locks when multiple instances may run.

## EF Core and relational databases
### Read paths
- Project only required columns.
- Use `AsNoTracking()` when entities are not updated.
- Identify N+1 patterns and unnecessary round trips.
- Pagination needs deterministic ordering.

### Write paths
- Define the consistency boundary first, then choose transaction scope.
- Use database constraints for invariants that must hold regardless of application bugs or concurrent writers.
- Consider optimistic concurrency for contested updates where conflicts can be retried or surfaced safely.

### Migrations
Prefer compatibility-preserving expand/migrate/contract changes:

```text
Add new shape → deploy compatible code → migrate/backfill → switch reads/writes → remove old shape later
```

This lowers deployment coupling and rollback risk.

## External integrations
Every production integration should answer:
- What is the timeout?
- Which failures are retryable?
- Is the operation idempotent?
- What happens after retry exhaustion?
- How is authentication handled?
- What data is allowed to leave the service?
- What logs/metrics/traces prove behavior?

Use `IHttpClientFactory` or equivalent managed client lifetime patterns for HTTP integrations. Retries should use jitter/backoff where suitable and must not amplify overload.

## Background jobs
Background work must define ownership of uniqueness and retries. Assume a job may execute more than once unless the scheduler/platform explicitly proves stronger guarantees.

Good job design includes:
- idempotent or duplicate-safe effects,
- bounded retry,
- cancellation/shutdown behavior,
- progress or correlation identity,
- dead-letter/manual recovery path where appropriate,
- observability for duration, failures, queue age, and retry count.

## Caching
Cache only when measurement or architecture justifies it. Always define source of truth, freshness, invalidation, fallback, stampede behavior, and memory/cost constraints. A cache that serves incorrect business state faster is still incorrect.

## Observability
Use three complementary evidence types:
- **Logs:** discrete contextual events.
- **Metrics:** trends, rates, saturation, latency percentiles.
- **Traces:** request dependency path and latency attribution.

Prefer structured logs with correlation identifiers. Avoid sensitive request/response payloads by default.

Useful service-level signals commonly include request rate, error rate, p50/p95/p99 latency, dependency duration/errors, DB duration/errors, thread/connection pool saturation, job queue age, job failure/retry counts, and process CPU/memory/GC indicators.

## Security
Backend code must assume all external input is hostile until validated. Enforce least privilege, explicit authorization, parameterized data access, secret separation, secure transport, and data minimization. Security control changes are design decisions, not debugging shortcuts.

## Review model
A senior review asks more than “does this code work?” It asks:
- Does it implement the intended behavior?
- Can concurrent calls break invariants?
- What happens under timeout, cancellation, partial dependency failure, and retry?
- Is data exposure minimized?
- Is query/runtime cost bounded?
- Can operations observe and recover it?
- Can another engineer understand and safely modify it?

## Verification hierarchy
Strong verification combines the cheapest reliable checks:
1. Static/compiler feedback.
2. Unit tests for local behavior.
3. Integration tests for persistence/integration boundaries.
4. API/E2E checks for critical vertical slices.
5. Runtime evidence for incidents/performance.

A green build does not prove behavior; a passing test suite does not prove a scenario that has no test. Map evidence to acceptance criteria.

## Failure recovery
Classify before retrying:
- transient dependency/network failure,
- deterministic validation failure,
- build/test failure,
- permission failure,
- environment/configuration failure,
- business-rule conflict.

Retry only transient failures, with a fixed maximum. For deterministic failures, change the input/code/configuration or escalate.

## Communication and handoff
Technical handoffs should contain objective, changed behavior, evidence, risks, assumptions, deployment/approval requirements, and unresolved questions. Business-facing communication should translate implementation details into user impact, risk, timing, and decision options without hiding technical constraints.

## Senior/Lead behavior
A Senior or Lead differs from a beginner by controlling scope, identifying hidden constraints earlier, selecting evidence efficiently, protecting compatibility and production safety, balancing short-term delivery with future cost, and escalating decisions that exceed role authority instead of silently making them.
