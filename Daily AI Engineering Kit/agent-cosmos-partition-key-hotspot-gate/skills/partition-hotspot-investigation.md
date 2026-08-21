# Partition Hotspot Investigation Skill

## Purpose
Detect and explain uneven logical-partition traffic in Azure Cosmos DB before changing partitioning, throughput, or data shape.

## When to use
Use when latency, 429 throttling, RU consumption, or request distribution suggests one or a small number of partition-key values dominate traffic.

## Inputs
- Container name and partition-key path.
- RU/request samples with `partition_key,request_units`.
- Relevant query/code paths and workload time window.
- Current throughput mode and known throttling evidence.

## Preconditions
- Work from non-secret telemetry or appropriately redacted exports.
- Do not require write access to production.
- Confirm the sample represents a coherent workload window.

## Allowed tools
Repository read/search, logs/metrics, exported CSV, local Python, test runner, Cosmos diagnostics/official metrics in read-only mode.

## Constraints
- A hot logical key is evidence, not proof that partition-key redesign is required.
- Separate read amplification, cross-partition query cost, and logical-key skew.
- Never alter a container, throughput, or data without explicit approval.

## Procedure
1. Identify the container, partition-key path, producers, consumers, and high-volume operations.
2. Gather a bounded telemetry sample and record source/time window.
3. Run `python scripts/analyze_partition_hotspots.py --input <csv> --policy config/policy.yaml --output hotspot-report.json`.
4. Inspect hot keys, RU share, request share, and sample sufficiency.
5. Trace each hot key to repository entry points and business entities.
6. Classify likely cause: naturally skewed tenant/user, poor key cardinality, fan-in design, cross-partition query, retries, background job concentration, or bad routing.
7. Form one hypothesis at a time and attach evidence.
8. Test low-risk mitigations first: query narrowing, batching, caching, scheduling distribution, request coalescing, or reducing duplicate work.
9. If partition-key redesign is still justified, hand off to `skills/remediation-design.md` and stop before implementation that recreates/migrates a container.

## Expected output
`hotspot-report.json` plus an evidence-backed finding stating affected key(s), workload, confidence, risk, and recommended action.

## Verification
- Sample size meets policy threshold or output is explicitly `insufficient-sample`.
- Re-running on the same input yields the same report.
- At least one repository/log evidence item supports each confirmed cause.

## Failure handling
Invalid telemetry is a validation failure: stop and preserve the rejected input description. Tool/metric failures may be retried twice; after that report blocked evidence collection.

## Stop conditions
Stop on insufficient evidence, missing permissions, contradictory telemetry, or any remediation requiring destructive migration/production change without approval.
