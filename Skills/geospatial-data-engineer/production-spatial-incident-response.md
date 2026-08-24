# Production Spatial Incident Response

## Purpose
Investigate and contain production incidents involving missing coverage, wrong coordinates, stale datasets, spatial-query failures, malformed geometry, or corrupted derived products.

## When to use
Use when a geospatial data or serving failure has user, operational, or analytical impact.

## Inputs
Incident symptoms, affected datasets/services, logs, metrics, deployment history, input versions, data lineage, known-good references.

## Context to inspect
Inspect recent deployments, source changes, CRS metadata, quality metrics, spatial extents, rejected-record counts, query plans, provider status, and caches.

## Core knowledge
Spatial incidents often appear as plausible but wrong output. Containment must protect correctness first, then freshness and performance. Data lineage and versioned outputs are essential for rollback.

## Procedure
1. Define the impact, affected geography, time window, and consumers.
2. Freeze destructive remediation and preserve evidence.
3. Compare current output with last known-good dataset/version.
4. Check source freshness, CRS, extent, counts, and geometry quality.
5. Correlate symptoms with deployments and input changes.
6. Reproduce the failure on a bounded sample.
7. Contain by rollback, disabling publication, switching to known-good data, or narrowing affected scope.
8. Verify containment with affected consumers.
9. Identify the causal chain rather than only the visible symptom.
10. Add regression checks and document residual risks before full restoration.

## Decision points
Prefer stale known-good data over fresh incorrect data when correctness is safety- or decision-critical. Roll forward only when the fix is simpler and lower risk than rollback.

## Common failure patterns
Reprocessing everything before understanding cause, deleting bad outputs before preserving evidence, assuming maps that render are correct, and clearing caches without identifying bad source data.

## Verification
Verify affected geography, known control features, freshness, quality metrics, service health, and consumer acceptance after remediation.

## Expected output
Incident timeline, containment action, root cause, verified recovery evidence, and prevention actions.

## Stop conditions
Escalate when authoritative data may be corrupted, legal/safety decisions are affected, rollback is unavailable, or restoration requires destructive changes.