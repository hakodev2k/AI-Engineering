# Emergency Access and Resilience Rules

## Purpose
Preserve controlled administrative access during IAM outages or policy failures without creating permanent bypasses.

## Scope
Break-glass accounts, emergency credentials, IdP outages, lockout recovery, and continuity procedures.

## MUST
- Emergency access paths MUST be independent enough to remain usable during expected IAM failure modes.
- Emergency credentials MUST be protected with stronger controls and limited distribution.
- Break-glass accounts MUST be monitored for any use and reviewed immediately after activation.
- Emergency access procedures MUST be tested on a defined schedule.
- Recovery plans MUST define how temporary emergency changes are reverted and reconciled.

## MUST NOT
- MUST NOT make emergency accounts part of routine administration.
- MUST NOT exclude break-glass identities from monitoring or ownership requirements.
- MUST NOT allow emergency exceptions to persist after normal IAM capability is restored.

## SHOULD
- Emergency access SHOULD minimize dependencies on the same control plane it is intended to recover.
- Tests SHOULD include policy lockout, federation failure, MFA outage, and directory-administration scenarios.

## Exceptions
Any untested or temporarily weakened emergency control requires explicit security leadership approval, compensating monitoring, and a remediation deadline.

## Verification
Inspect break-glass inventory, credential custody, usage alerts, test records, outage exercises, and post-event reconciliation evidence.