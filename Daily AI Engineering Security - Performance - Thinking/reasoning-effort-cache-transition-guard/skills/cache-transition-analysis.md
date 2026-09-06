# Skill: Cache-Preserving Reasoning Transition Analysis

## Purpose
Measure whether dynamic reasoning-effort changes preserve a reusable prompt prefix without sacrificing task quality.

## Trigger
Use when migrating to a model/API that supports cache-preserving effort changes, when cache hit rate drops after dynamic routing, or when request-level effort changes are observed in long sessions.

## Inputs
Sequential request traces, model/API compatibility declaration, baseline and candidate runs, acceptance-test results, and provider cache counters when available.

## Preconditions
Workloads are comparable; sensitive prompt bodies may be replaced with hashes/lengths as long as sequence and cache metrics remain usable.

## Required context
Model, API endpoint, session topology, stable prefix definition, expected effort transitions, pricing/latency objectives, and quality acceptance criteria.

## Allowed tools
Trace parser, JSON inspection, deterministic audit script, benchmark runner, provider documentation, and aggregate metrics.

## Constraints
Do not remove correctness-critical context to improve caching. Do not infer cache preservation from latency alone. Do not apply `configuration_update` to an undocumented incompatible topology.

## Procedure
1. Record a baseline workload with request sequence, request-level effort, effective requested effort, cache counters, latency, and quality outcome.
2. Identify every effort transition and whether it changes request-level `reasoning.effort` or arrives as a `configuration_update` input item.
3. Mark the flow compatibility: `compatible`, `incompatible`, or `unknown` based on current provider documentation and application topology.
4. Run `scripts/cache_transition_audit.py` to identify request-shape violations.
5. Compute baseline cached-input ratio and cache-write/uncached-input totals where counters exist.
6. Form one hypothesis, e.g. 'request-level effort mutation invalidates the reusable prefix; moving compatible transitions into configuration_update should increase cached-input ratio without changing acceptance-test results.'
7. Change only the transition serialization path; keep task, stable prefix, model and other request fields controlled.
8. Repeat the workload at least three times for baseline and candidate when cost permits.
9. Compare median cache ratio, cache writes, uncached input, latency, and quality pass rate.
10. Hand evidence to an independent verifier.

## Decision points
- **Pass**: no request-level mutation in declared compatible sessions, cache metrics improve or remain healthy, and quality stays within tolerance.
- **Review**: compatibility is unknown or cache counters are unavailable; preserve correctness and require manual/provider-specific review.
- **Fail**: request-level effort mutates in a declared compatible cache-preserving flow, or cost/latency worsens materially without a quality justification.

## Expected output
Transition audit, before/after metric table, compatibility evidence, hypothesis result, residual risks, and verification state.

## Metrics
Cached-input ratio, cache-write tokens, uncached-input tokens, total input, cost/task, p50/p95 latency, pass rate, and invalid transition count.

## Verification
Independent verifier repeats the audit and checks that the candidate workload is equivalent and quality does not regress.

## Failure handling
At most two tuning iterations. If the flow is incompatible or provider telemetry is insufficient, document the limitation and fall back to stable request-level effort rather than claiming cache preservation.

## Stop conditions
Stop after verified improvement, after two failed tuning iterations, or when correctness/compatibility uncertainty prevents a safe migration.
