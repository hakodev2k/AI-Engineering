# Workflow: Baseline → Migrate → Verify

## Trigger
A compatible long-running Responses API workflow changes reasoning effort between turns or is migrating to GPT-6 Astra.

## Goal
Preserve the reusable prompt prefix while retaining task quality and reducing avoidable uncached input/cache writes/latency.

## Inputs
Representative workload, sequential traces, compatibility declaration, quality tests, and cache/latency counters.

## Baseline
Run the existing implementation at least three times when feasible. Capture request-level effort, effective effort, cached input, cache writes, uncached input, latency, total cost if available, and acceptance result per turn/task.

## Context
Use `skills/cache-transition-analysis.md` and `rules/cache-prefix-stability.md`.

## Stages
1. **Observe** — identify all effort transitions and cache metric discontinuities.
2. **Measure baseline** — aggregate median cache ratio, write/uncached tokens, latency and pass rate.
3. **Diagnose** — determine whether effort is mutated at request level and whether the topology supports `configuration_update`.
4. **Hypothesize** — state the expected cache/latency effect and quality invariant.
5. **Implement** — for documented compatible flows, keep request-level effort stable and serialize turn-level changes as trusted `configuration_update` items.
6. **Measure again** — repeat the same workload at least three times when feasible.
7. **Compare** — evaluate metric deltas and unchanged acceptance tests.
8. **Independent verify** — `subagents/cache-verifier.md` reruns the audit and reviews comparison integrity.

## Responsible agent
Integration owner for stages 1–7; independent Cache Transition Verifier for stage 8.

## Tools
Provider docs, request trace collection, `scripts/cache_transition_audit.py`, workload tests, latency/cost aggregation.

## Outputs
Baseline/candidate traces, audit findings, metric comparison, compatibility evidence, and final verification state.

## Checkpoints
- Workload and correctness-critical context are unchanged.
- Topology compatibility is documented before using `configuration_update`.
- Request-level effort remains stable in compatible candidate sessions.
- Quality is evaluated independently of cache metrics.

## Metrics
Cached-input ratio, cache-write tokens/task, uncached input/task, total input/task, cost/task, p50/p95 latency, quality pass rate, invalid transition count.

## Retry policy
Maximum two tuning iterations. Each retry must change the hypothesis or implementation based on new evidence.

## Stop conditions
Stop on verified improvement; after two unsuccessful iterations; when quality regresses beyond tolerance; or when compatibility remains unknown and provider review is required.

## Failure path
Cache regression → restore last known correct request shape, preserve traces, diagnose changed prefix fields. Quality regression → reject optimization even if cache improves. Missing counters → use request-shape audit but classify cache benefit as unmeasured, not verified.

## Verification
Independent audit shows zero invalid request-level transitions in declared compatible sessions, quality remains within tolerance, and measured cache/cost/latency results support the claimed outcome.

## Definition of Done
Implemented: transition path migrated. Measured: baseline/candidate metrics collected. Verified: independent request-shape audit and quality checks pass, with no blocking compatibility issue.
