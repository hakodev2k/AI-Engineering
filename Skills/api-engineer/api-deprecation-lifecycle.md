# API Deprecation Lifecycle

## Purpose
Retire API operations and versions safely using evidence, communication, and enforceable timelines.

## When to use
Use when replacing endpoints, versions, fields, authentication schemes, or legacy behaviors.

## Inputs
Consumer inventory, usage telemetry, replacement contract, support commitments, and target dates.

## Context to inspect
Gateway logs, SDK versions, documentation, contracts, client owners, and operational dependencies.

## Core knowledge
Deprecation is a migration process, not a documentation label. Unknown consumers and hidden automation are major risks.

## Procedure
1. Define what is deprecated and why.
2. Confirm a viable replacement.
3. Measure current usage by consumer.
4. Publish migration instructions and deadlines.
5. Add machine-visible deprecation signals where practical.
6. Contact high-impact consumers.
7. Track migration progress.
8. Test removal in lower environments.
9. Enforce final cutoff only after policy gates pass.
10. Monitor errors after removal.

## Decision points
Extend deadlines only when business risk of removal exceeds maintenance risk; do not keep obsolete versions indefinitely by default.

## Common failure patterns
Removing based on code search alone, no usage telemetry, vague deadlines, replacement missing features, and silent behavior changes.

## Verification
Usage reaches approved threshold, replacement workflows pass, and rollback/incident plan is ready.

## Expected output
A measurable deprecation and retirement plan.

## Stop conditions
Escalate when active consumers cannot migrate within contractual or operational constraints.