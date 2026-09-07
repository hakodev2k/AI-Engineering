# Change Window Rules

## Purpose
Choose production change timing that preserves supportability, recovery capacity, and business continuity.

## Scope
Applies to planned release windows, maintenance periods, blackout periods, and coordinated production changes.

## MUST
- Release windows MUST account for business critical periods, staffing, dependency availability, support coverage, monitoring coverage, and expected recovery duration.
- High-risk changes MUST have sufficient staffed time remaining in the window to detect failure and execute the documented recovery plan.
- Overlapping material changes MUST be evaluated for correlated risk and diagnostic ambiguity.
- Time-zone and regional impact MUST be considered when the release affects geographically distributed users or operators.
- Window changes MUST be communicated to affected owners and reflected in the authoritative release record.

## MUST NOT
- A release MUST NOT begin when required responders, approvers, or recovery capabilities are unavailable.
- A maintenance window MUST NOT be treated as permission to bypass readiness gates.
- A release MUST NOT intentionally run past a defined freeze or business constraint without an approved exception.

## SHOULD
- High-impact changes SHOULD avoid periods where unrelated incidents or major events reduce operational capacity.
- Release windows SHOULD include explicit checkpoints for continue, pause, rollback, or abort decisions.

## Exceptions
Urgent exceptions require documented urgency, customer/business impact of waiting, staffing confirmation, risk controls, recovery readiness, and authorized approval.

## Verification
Inspect the release calendar, on-call/support coverage, dependency-owner availability, freeze constraints, checkpoints, recovery timing, and recorded approvals.