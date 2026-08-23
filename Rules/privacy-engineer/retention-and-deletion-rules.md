# Retention and Deletion Rules

## Purpose
Ensure personal data is retained only as long as necessary and deleted predictably.

## Scope
Primary stores, replicas, caches, logs, archives, backups, derived datasets, and downstream processors.

## MUST
- Personal-data categories MUST have approved retention rules tied to purpose and obligations.
- Deletion mechanisms MUST cover primary and derived copies or document justified limitations.
- Retention jobs MUST be observable, failure-detectable, and periodically tested.
- Legal holds or preservation requirements MUST override normal deletion only for documented scope and duration.
- Deletion requests MUST propagate to downstream systems within defined SLAs where required.

## MUST NOT
- MUST NOT retain personal data indefinitely by default.
- MUST NOT claim deletion when recoverable operational copies remain without a documented retention boundary.

## SHOULD
- Prefer automated expiration and lifecycle policies over manual cleanup.

## Exceptions
Exceptions require reason, data scope, owner, expiry, controls, and approval.

## Verification
Review retention schedules, lifecycle configurations, deletion test results, backup behavior, processor confirmations, and exception records.