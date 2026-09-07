# Release Calendar and Capacity Rules

## Purpose
Coordinate release demand with operational capacity so concurrent changes do not exceed the organization's ability to detect, support, and recover from failures.

## Scope
Applies to release scheduling, shared environments, operational staffing, business events, and cross-team change concurrency.

## MUST
- The release calendar MUST expose material changes, blackout periods, major business events, shared-resource constraints, and support coverage relevant to scheduling decisions.
- Concurrent high-risk releases MUST be evaluated for correlated dependencies, shared failure domains, responder contention, and diagnostic ambiguity.
- Release scheduling MUST reserve sufficient operational capacity for observation and recovery, not deployment execution alone.
- Material calendar conflicts MUST be resolved by explicit prioritization and accountable ownership.
- Schedule changes affecting dependencies or support commitments MUST trigger notification and readiness revalidation where relevant.

## MUST NOT
- Teams MUST NOT overload a change window merely because each individual release is independently approved.
- Calendar capacity MUST NOT be inferred solely from available deployment slots when responder or infrastructure capacity is constrained.
- Business-critical periods MUST NOT be ignored without an approved exception.

## SHOULD
- Portfolio-level scheduling SHOULD spread unrelated high-risk changes when doing so improves isolation and recoverability.
- Historical incident and deployment-duration evidence SHOULD inform capacity planning.

## Exceptions
Urgent concurrency requires documented priority, dependency analysis, responder coverage, recovery capacity, residual risk, and authorized approval.

## Verification
Review release calendar entries, overlapping risk classifications, shared dependencies, staffing/on-call coverage, business constraints, recovery windows, and conflict-resolution records.