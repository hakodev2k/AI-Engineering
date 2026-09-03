# Skill: Trace Payload Analysis

## Purpose
Measure observability payload cost and identify the attributes/spans that dominate agent trace volume.

## Trigger
When tracing is enabled or changed, latency/export drops appear, multimodal/tool payload capture grows, or agent fanout increases.

## Inputs
JSON/JSONL spans, payload budget, tracing-on/off latency samples when available.

## Preconditions
Representative traces from the same workload and a documented baseline.

## Procedure
1. Measure serialized bytes per span and trace.
2. Calculate p50, p95, max span size and total trace bytes.
3. Rank attributes by serialized bytes.
4. Identify budget violations and exporter-limit risk.
5. Form one optimization hypothesis: reduce or externalize a dominant non-protected payload.
6. Apply one change.
7. Measure again with the same workload.
8. Verify protected fields and debugging evidence remain present.
9. Stop after improvement or after three unsuccessful iterations.

## Decision points
If a protected field dominates size, redesign its representation rather than deleting it. If exporter drops persist below configured budgets, investigate transport/provider limits separately.

## Expected output
Baseline, top contributors, violations, hypothesis, before/after metrics, verification result.

## Metrics
Bytes/task, p95 span bytes, maximum attribute bytes, exporter drops, latency delta, protected-field coverage.

## Failure handling
Maximum three optimization attempts. Preserve the previous working telemetry configuration for fallback.

## Stop conditions
Verified improvement with no critical diagnostic loss, or escalation after three failed hypotheses.
