# Snapshot and Clone Rules

## Purpose
Use snapshots and clones safely without confusing convenience copies with independent recovery.

## Scope
Point-in-time snapshots, copy-on-write clones, consistency groups, retention, and lifecycle.

## MUST
- Snapshot consistency semantics MUST match application recovery requirements.
- Application-consistent snapshots MUST coordinate quiescing or transactional mechanisms when crash consistency is insufficient.
- Snapshot retention MUST account for capacity amplification and deletion dependencies.
- Restore from snapshots MUST be tested for critical workloads.

## MUST NOT
- MUST NOT represent snapshots sharing the same failure domain as independent backups.
- MUST NOT retain uncontrolled snapshots that can exhaust pool capacity.
- MUST NOT delete snapshots required by an active recovery, legal, or retention obligation.

## SHOULD
- Automate lifecycle policies with explicit protected exceptions.

## Exceptions
Long-lived snapshots require documented ownership, capacity impact, expiry, and review.

## Verification
Inspect snapshot policies, dependency chains, capacity usage, application consistency settings, and restore-test evidence.