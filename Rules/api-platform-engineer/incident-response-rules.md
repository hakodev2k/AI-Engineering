# Incident Response

## Purpose
Restore API service safely while preserving evidence and consumer communication.

## Scope
Detection, triage, mitigation, rollback, escalation, and post-incident learning.

## MUST
- Incident decisions MUST use available logs, metrics, traces, alerts, and change history as evidence.
- Mitigations MUST prioritize blast-radius reduction and reversibility.
- Consumer-impacting incidents MUST identify affected routes, versions, tenants, and time windows when evidence permits.
- Security incidents MUST follow the applicable security-response process.

## MUST NOT
- MUST NOT make destructive production changes without required approval merely to accelerate diagnosis.
- MUST NOT erase evidence or silently alter audit data.

## SHOULD
- Hypotheses SHOULD be recorded and falsified systematically during complex incidents.

## Exceptions
Emergency actions require contemporaneous rationale and retrospective review.

## Verification
Review incident timeline, evidence links, change records, approvals, recovery metrics, and corrective actions.