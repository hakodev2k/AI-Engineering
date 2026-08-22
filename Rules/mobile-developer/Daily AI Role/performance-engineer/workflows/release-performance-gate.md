# Workflow: Release Performance Gate

## Trigger
Release/change classified as performance-sensitive or benchmark-protected.

## Preconditions
Stable benchmark contract and accepted variance.

## Stages
1. Validate contract and environment.
2. Run baseline or approved reference.
3. Run candidate using same protocol.
4. Evaluate hard budgets and noise-aware thresholds.
5. If failed, retry once only when the run is proven invalid; otherwise investigate rather than rerun until green.
6. Require human approval to accept a material regression.
7. Store evidence and decision.

## Output
Pass, fail, or approved exception with metric deltas and evidence.

## Definition of done
Decision is traceable, reproducible, and linked to the release.