# Skill: Cache Breakpoint Analysis
## Purpose
Find request-level cache continuity failures around MCP tool discovery and convert them into measurable batch-size hypotheses.
## Trigger
Latency or token-cost regression after MCP enablement, ToolSearch or catalog changes.
## Inputs
JSONL telemetry with discovery events and request token/latency metrics.
## Preconditions
At least one discovery event followed by a measured model request.
## Required context
Telemetry metadata only; prompt contents are unnecessary.
## Allowed tools
Read-only trace parsing, the deterministic profiler, benchmark reports.
## Constraints
MUST establish a baseline. MUST NOT claim improvement from schema count alone. MUST preserve required tool availability and correctness.
## Procedure
1. Capture baseline trace.
2. Segment requests around discovery events.
3. Measure cache-read ratio, cache-creation ratio and post-discovery latency.
4. Identify suspicious batch sizes.
5. Form a bounded batch-size hypothesis.
6. Re-run equivalent workload.
7. Compare before/after and reject changes that harm tool coverage.
## Decision points
If telemetry is incomplete, return `insufficient_evidence`. If no breakpoint is detected, do not recommend a batch limit.
## Expected output
Measured breakpoints, candidate max batch, p50/p95 post-discovery latency and verification status.
## Metrics
Cache-read ratio, cache-creation/input ratio, p50/p95 latency, input tokens/request, batch size.
## Verification
Independent benchmark rerun on equivalent workload.
## Failure handling
Maximum 2 optimization iterations; revert on correctness regression.
## Stop conditions
Stop when measured improvement is verified, evidence is insufficient, or two bounded attempts fail.
