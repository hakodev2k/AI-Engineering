# Testing and Fault Injection Rules

## Purpose
Prove storage behavior under failures that normal functional tests do not cover.

## Scope
Applies to integration, recovery, resilience, corruption, saturation, and fault-injection testing.

## MUST
- Test critical write, read, recovery, failover, and degraded-mode paths.
- Define expected invariants before fault injection and verify them afterward.
- Bound blast radius and establish abort conditions before production experiments.

## MUST NOT
- Inject destructive faults into production without explicit human approval and a reviewed experiment plan.
- Treat a single successful fault test as permanent proof of resilience.
- Use synthetic workloads alone when representative production behavior materially differs.

## SHOULD
- Automate repeatable failure scenarios in non-production and run them after material platform changes.
- Include correlated and slow-degradation failures, not only clean crashes.

## Exceptions
Production testing requires documented necessity, safeguards, observers, rollback, and approval.

## Verification
Review test plans, invariant checks, fault logs, recovery results, regression suites, and experiment approvals.