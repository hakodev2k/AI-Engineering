# SLO and SLI Rules

## Purpose
Define measurable reliability objectives that connect user experience to engineering decisions.

## Scope
Applies to production services, critical user journeys, shared platforms, and dependencies with reliability commitments.

## MUST
- Every critical service MUST define SLIs that measure user-observable outcomes such as availability, latency, correctness, or freshness.
- SLOs MUST specify a target, measurement window, population, and data source.
- SLO calculations MUST exclude data only through documented and reviewable criteria.
- Reliability decisions MUST use current SLI/SLO evidence rather than intuition alone.
- SLO ownership MUST be assigned to a responsible team.

## MUST NOT
- MUST NOT use infrastructure health alone as a substitute for user-facing reliability.
- MUST NOT set an SLO without verifying that the telemetry can measure it consistently.
- MUST NOT silently change SLO definitions to make performance appear better.

## SHOULD
- Prefer a small set of meaningful SLIs over large dashboards with weak operational value.
- SLOs SHOULD reflect business criticality and realistic engineering cost.

## Exceptions
Temporary objectives require documented scope, duration, risk, and approval from the responsible owner.

## Verification
Review SLO documents, telemetry queries, dashboards, alert definitions, and historical calculations. Recompute sample windows to confirm reproducibility.