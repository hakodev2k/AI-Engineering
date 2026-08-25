# Backup Policy

## Purpose
Translate recovery requirements into explicit protection schedules, retention, and ownership.

## Scope
All workloads approved for backup protection.

## MUST
- Policies MUST define scope, frequency, retention, copy count, storage class, encryption, monitoring, and ownership.
- Policy assignment MUST be traceable to workload classification and recovery objectives.
- Exclusions MUST be explicit, approved, and periodically reviewed.
- Policy changes affecting recoverability MUST be reviewed before activation.

## MUST NOT
- MUST NOT rely on implicit defaults for critical workloads.
- MUST NOT reduce retention or frequency without impact analysis and approval.
- MUST NOT infer successful protection from job scheduling alone.

## SHOULD
- Policies SHOULD be managed as versioned configuration where supported.
- Standard tiers SHOULD be used to reduce configuration drift while allowing justified exceptions.

## Exceptions
Exceptions require rationale, affected recovery objectives, compensating controls, approval, and review date.

## Verification
Compare workload inventory to assigned policies; inspect configuration history, retention settings, exclusions, monitoring, and sampled restore points.