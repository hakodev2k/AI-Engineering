# Data SLOs and SLAs

## Purpose
Define measurable reliability objectives for data products so producers and consumers share explicit expectations for freshness, completeness, accuracy, availability, and recovery.

## When to use
Use for business-critical datasets, data products with recurring reliability disputes, or platforms introducing formal service ownership.

## Inputs
Consumer requirements, business criticality, pipeline schedules, historical performance, incident history, dependency constraints.

## Preconditions
A named data product, identifiable consumers, and measurable delivery or quality signals.

## Context to inspect
Review refresh cadence, query usage, decision deadlines, upstream availability, backfills, maintenance windows, and current alert thresholds.

## Core knowledge
SLIs are measurements, SLOs are internal reliability targets, and SLAs are explicit commitments that may carry business consequences. Objectives should represent user-visible reliability rather than infrastructure uptime alone. Error budgets help balance reliability investment against delivery velocity.

## Procedure
1. Identify consumer workflows and consequences of bad or late data.
2. Choose a small set of user-relevant SLIs.
3. Define measurement windows and exclusions explicitly.
4. Establish realistic SLO targets from business need and observed capability.
5. Separate internal SLOs from contractual SLAs.
6. Define error-budget consumption and escalation policy.
7. Map each SLO to telemetry and ownership.
8. Test calculations against historical incidents.
9. Review objectives with producers and consumers.
10. Reassess periodically as usage changes.

## Decision points
Use stricter targets only where business impact justifies cost. Prefer percentile or window-based freshness where workloads vary. Avoid universal platform-wide SLOs when datasets have different criticality.

## Common failure patterns
- Calling infrastructure uptime a data SLA
- Targets with no measurable SLI
- Ignoring planned maintenance and source constraints
- Setting 100% objectives without cost analysis
- No response policy for budget burn

## Verification
Recalculate SLO attainment from raw telemetry, replay known incidents, and confirm alerts trigger before material consumer impact where feasible.

## Expected output
Documented SLIs, SLOs, optional SLAs, error-budget policy, measurement queries, and ownership.

## Stop conditions
Escalate when consumer expectations conflict with feasible source guarantees or when contractual commitments require legal or executive approval.