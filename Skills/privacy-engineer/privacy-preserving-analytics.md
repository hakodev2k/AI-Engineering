# Privacy-Preserving Analytics

## Purpose
Deliver useful product and business measurement while minimizing individual-level tracking and unnecessary raw-data retention.

## When to use
Use for product analytics, experimentation, reporting, audience measurement, and behavioral metrics.

## Inputs
Questions to answer, metric definitions, event schema, identity requirements, aggregation needs, retention, and access model.

## Context to inspect
Inspect event payloads, stable identifiers, join keys, raw-event access, small cohorts, exports, and third-party analytics behavior.

## Core knowledge
Analytics requirements should start from decisions and metrics, not maximal event capture. Aggregation, sampling, coarse dimensions, short retention, and privacy-enhancing techniques can reduce risk.

## Procedure
1. Define decisions and metrics.
2. Derive minimum events and fields needed.
3. Avoid stable identity when session or aggregate measures suffice.
4. Coarsen sensitive dimensions.
5. Set minimum cohort thresholds where appropriate.
6. Separate raw ingestion from broad analyst access.
7. Aggregate early and expire raw events.
8. Evaluate re-identification through joins.
9. Validate metrics after minimization.

## Decision points
Use differential privacy or related techniques when repeated statistical release creates meaningful inference risk and expertise is available.

## Common failure patterns
Tracking everything, permanent user IDs, exact location/time, unrestricted raw SQL access, and tiny cohort reporting.

## Verification
Confirm required metrics remain accurate enough while rejected data is absent from collection and reports.

## Expected output
An analytics design with explicit utility/privacy trade-offs.

## Stop conditions
Escalate analytics that requires disproportionate sensitive tracking or unresolved individual inference risk.