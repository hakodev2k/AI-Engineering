# Memory Incident Response Rules

## Purpose
Contain and investigate memory failures that cause leakage, poisoning, stale decisions, corruption, or unsafe personalization.

## Scope
Detection, containment, evidence, rollback, purge, communication, and corrective actions.

## MUST
- Incidents MUST identify affected memory classes, users or tenants, time range, and retrieval paths where evidence permits.
- Containment MUST prioritize stopping further unsafe reads or writes before broad remediation.
- Investigation MUST preserve relevant provenance, logs, indexes, and deployment evidence.
- Corrective action MUST include validation that poisoned, leaked, or invalid memory is no longer retrievable.

## MUST NOT
- MUST NOT mass-delete production memory without approved scope and recovery strategy unless emergency authority explicitly permits it.
- MUST NOT claim root cause solely from model speculation.
- MUST NOT restore quarantined memory before validation.

## SHOULD
- Add regression tests for confirmed failure modes.
- Document bounded uncertainty when root cause cannot be proven.

## Exceptions
Emergency actions require incident authority, minimized blast radius, audit trail, and post-event review.

## Verification
Review incident records, containment evidence, purge checks, regression tests, and post-incident actions.