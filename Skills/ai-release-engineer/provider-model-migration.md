# Provider and Model Migration

## Purpose
Migrate workloads between model versions or providers without silently breaking quality, safety, contracts, latency, privacy, or cost expectations.

## When to use
Use for deprecations, provider outages, model upgrades, region changes, contract changes, or strategic vendor migration.

## Inputs
Current and target models, API contracts, evaluation suites, token limits, tool-calling behavior, privacy terms, latency/cost baselines.

## Preconditions
A representative comparison set and rollback route exist.

## Context to inspect
Model gateway, SDK versions, structured output schemas, safety behavior, context windows, tool semantics, retry rules, quotas, data residency, and pricing.

## Core knowledge
Models marketed as replacements can differ in tokenization, instruction following, refusal patterns, tool calling, JSON reliability, context handling, and latency. Compatibility must be demonstrated rather than assumed.

## Procedure
1. Inventory capabilities depended on by each workload.
2. Map API and semantic differences.
3. Run paired offline evaluations.
4. Test structured outputs and tool execution separately.
5. Compare safety, privacy, latency, throughput, and cost.
6. Validate provider retention and regional requirements.
7. Update adapters and routing logic.
8. Shadow or canary representative production traffic.
9. Monitor segment-level regressions.
10. Remove old routing only after stable recovery evidence and rollback window requirements are met.

## Decision points
Allow mixed-model routing when workloads have different quality/cost requirements. Avoid forced migration of high-risk workloads until equivalent controls are validated.

## Common failure patterns
Benchmarking only generic quality, overlooking schema differences, assuming identical safety behavior, and cutting over all traffic at once.

## Verification
Confirm target-model behavior against workload-specific acceptance criteria and validate rollback to the previous route.

## Expected output
A migration plan, compatibility matrix, evaluation evidence, staged rollout, and decommission criteria.

## Stop conditions
Stop when target behavior violates critical quality, privacy, security, or compliance requirements.