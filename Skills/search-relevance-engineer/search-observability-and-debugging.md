# Search Observability and Debugging

## Purpose
Instrument and investigate search behavior so relevance regressions, latency failures, missing results, and ranking anomalies can be traced to concrete pipeline stages.

## When to use
Use for production incidents, unexplained query regressions, model/index rollouts, or building search monitoring.

## Inputs
Query/request IDs, logs, metrics, traces, score explanations, index/model versions, query DSL, result sets, recent changes.

## Context to inspect
Request tracing, query rewrite logs, candidate counts, retriever provenance, ranking features, model versions, shard failures, timeouts, fallbacks, and deployment history.

## Core knowledge
Effective debugging requires preserving the transformation path from raw query to final ranking. Observability must balance explainability with privacy and cardinality cost.

## Procedure
1. Capture an affected query and stable reproduction context.
2. Identify deployed index, analyzer, model, feature, and configuration versions.
3. Trace query normalization and rewrites.
4. Compare candidate sets by retrieval stage.
5. Inspect filtering and authorization effects.
6. Explain ranking scores or feature contributions where available.
7. Check timeouts, partial failures, fallbacks, and shard errors.
8. Compare against a known-good version or query cohort.
9. Form and test one causal hypothesis at a time.
10. Add regression coverage and telemetry for the confirmed failure mode.

## Decision points
Use detailed per-query diagnostics on sampled or explicitly debugged traffic; aggregate metrics for continuous monitoring. Redact sensitive query content when raw text is unnecessary.

## Common failure patterns
Logging only final results, missing version identifiers, no retrieval provenance, debugging with different index state, high-cardinality metrics, and changing multiple variables while reproducing.

## Verification
Confirm the root cause by reproducing failure before the fix and success after it while holding unrelated versions constant; verify new monitoring detects recurrence.

## Expected output
Root-cause evidence, affected scope, corrective change, regression test, telemetry improvement, and residual risk.

## Stop conditions
Escalate when reproduction requires unauthorized production data, evidence points to infrastructure outside ownership, or logs are insufficient to distinguish competing causes.