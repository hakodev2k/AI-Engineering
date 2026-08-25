# Skill — Measure and Optimize MCP Skill Materialization

## Purpose
Diagnose request/byte amplification and produce a bounded lazy-fetch plan.

## Trigger
Slow client startup, high MCP request volume, large skill catalogs, cache misses, or adoption of Skills-over-MCP.

## Inputs
Catalog JSON, representative task-required skills or relevance scores, cache state, resource size estimates, request/byte/concurrency budgets, and traces.

## Preconditions
Use a representative workload and preserve security/provenance checks.

## Required context
Know which resources are catalog metadata vs skill bodies/supporting files and which skills are actually required by each task.

## Allowed tools
Trace analysis, deterministic planner script, load-test harnesses, server metrics, cache metrics.

## Constraints
Do not claim improvement without a baseline. Do not delete required context to hit a target. Do not increase concurrency beyond server/platform policy.

## Procedure
1. Measure baseline cold and warm paths: requests, bytes, p50/p95 latency, cache hits, errors.
2. Attribute requests to discovery, selected materialization, duplicate fetch, stale refresh, or speculative prefetch.
3. Form a hypothesis identifying the dominant amplification source.
4. Use `scripts/skill_materialization_planner.py` to generate a bounded plan.
5. Integrate lazy selection, digest reuse, URI deduplication, and concurrency cap.
6. Repeat the exact workload.
7. Compare task success/quality and required-skill recall in addition to performance.
8. Independent verifier confirms measurements and absence of security regressions.

## Decision points
- Required skill omitted: optimization fails.
- Requests/bytes unchanged: reject the hypothesis and retry once with a new diagnosis.
- Server errors rise: lower concurrency/prefetch and re-measure.
- Security/provenance validation bypassed: block completion.

## Expected output
Baseline table, hypothesis, plan, before/after metrics, quality/regression result, and verification status.

## Metrics
Requests/task, bytes/task, p95 latency, cache hit ratio, selected-skill precision/recall, server error rate.

## Verification
Improvement must be reproducible on at least three representative runs or an agreed benchmark sample, with no critical skill loss.

## Failure handling
Maximum 2 optimization iterations. If budgets cannot include all task-required skills, return explicit budget exhaustion instead of silently omitting them.

## Stop conditions
Stop when measurable improvement is verified, two hypotheses fail, or a correctness/security regression appears.
