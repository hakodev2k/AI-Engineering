# Bulkhead Design Skill

## Purpose
Design resource isolation for agent tools, workers, integrations, or background jobs so one overloaded dependency cannot consume all shared capacity.

## When to use
Use when independent workloads share threads, connections, queues, rate limits, worker slots, or downstream dependencies and one workload can starve others.

## Inputs
- Workload/resource names
- Current concurrency and queue behavior
- Latency/error evidence
- Dependency limits
- Criticality and SLOs
- Existing retry/timeout policy

## Preconditions
- Repository and runtime topology are identifiable.
- At least one concrete shared resource or dependency exists.

## Allowed tools
Repository search, logs, metrics, test runners, load-test tools, configuration inspection, read-only production telemetry.

## Constraints
- Do not change production capacity or disable isolation without explicit approval.
- Do not compensate for overload by adding unbounded retries or queues.

## Procedure
1. Identify workloads competing for the same finite resource.
2. Map each workload to downstream dependencies and shared pools.
3. Gather evidence: concurrency, p95/p99 latency, queue depth, rejection rate, timeout rate, and saturation.
4. Classify workloads by criticality and acceptable failure mode.
5. Choose isolation boundaries: per dependency, tenant class, task class, or risk class.
6. Set initial `max_concurrency` from measured dependency capacity, not CPU count alone.
7. Set a bounded queue; prefer fast rejection over hidden unbounded backlog.
8. Ensure `queue_timeout_ms < execution_timeout_ms` and both fit the caller's end-to-end deadline.
9. Define rejection/fallback behavior explicitly.
10. Validate retry policy cannot multiply pressure after rejection or timeout.
11. Add deterministic policy validation using `scripts/validate_bulkhead.py`.
12. Run unit tests plus a saturation test that overloads one partition while measuring unaffected partitions.
13. Compare before/after evidence and record remaining risk.

## Expected output
A policy file plus an evidence-backed isolation plan with workload boundaries, limits, failure behavior, and verification results.

## Verification
Success requires policy validation, bounded queues, bounded retries, no cross-partition starvation in saturation tests, and no approval-boundary violations.

## Failure handling
If capacity evidence is missing, use conservative defaults and mark limits provisional. If tests show starvation, reduce coupling or split the resource pool further.

## Stop conditions
Stop before any production capacity/configuration change requiring approval, or when dependency capacity cannot be safely inferred from available evidence.
