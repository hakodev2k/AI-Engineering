# Data Incident Response Rules

## Purpose
Contain, diagnose, communicate, and recover from production data incidents safely.

## Scope
Incorrect, missing, stale, duplicated, exposed, or materially delayed production data.

## MUST
- Assess blast radius, affected time range, consumers, and business impact before broad remediation.
- Preserve evidence needed for root-cause analysis before destructive cleanup when feasible.
- Stop or quarantine propagation when continuing processing can amplify corruption.
- Communicate known facts, uncertainty, and recovery status to affected owners.
- Verify corrected data before declaring recovery.

## MUST NOT
- Perform destructive remediation without understanding rollback and reconciliation implications.
- Declare resolution solely because pipeline execution returns to green.
- Modify evidence to make incident metrics appear healthier.

## SHOULD
- Maintain runbooks for common high-impact failure modes.
- Produce follow-up actions that address systemic causes, not only symptoms.

## Exceptions
Emergency containment may precede full diagnosis when damage is actively expanding, but actions require auditability and post-incident review.

## Verification
Review incident timelines, logs, lineage, containment actions, reconciliation results, communications, and corrective-action records.