# Ranking Signal Rules

## Purpose
Ensure ranking signals are valid, interpretable, stable, and safe to use.

## Scope
Applies to textual, behavioral, semantic, freshness, authority, quality, and business signals.

## MUST
- Every production ranking signal MUST have a defined meaning, source, freshness expectation, and failure behavior.
- New signals MUST be evaluated for leakage, redundancy, bias, and sensitivity before release.
- Missing or stale values MUST have explicit handling.
- High-impact signal changes MUST be compared against a stable baseline.

## MUST NOT
- MUST NOT use future information or post-outcome data in offline training or evaluation.
- MUST NOT let one unbounded signal dominate ranking without intentional design and evidence.
- MUST NOT infer causal value from correlation alone.

## SHOULD
- Monitor signal distributions and drift by important segments.

## Exceptions
Require evidence, affected scope, risk, and approval.

## Verification
Review feature definitions, lineage, distribution checks, ablations, offline metrics, and production monitoring.