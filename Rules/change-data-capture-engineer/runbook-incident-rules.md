# Runbook and Incident Rules

## Purpose
Make CDC incidents diagnosable and recoverable without unsafe improvisation.

## Scope
Runbooks, triage, escalation, evidence preservation, mitigation, and post-incident review.

## MUST
- Critical pipelines MUST have runbooks for stalled capture, retention exhaustion, schema failure, sink outage, and checkpoint loss.
- Triage MUST establish last known good source and downstream positions before corrective movement.
- Incident actions MUST preserve evidence needed to determine gaps or duplicates.
- Mitigation MUST prioritize data correctness and source safety over cosmetic health status.
- Significant incidents MUST record impact, timeline, evidence, corrective actions, and verification.

## MUST NOT
- MUST NOT reset positions before recording prior state.
- MUST NOT purge backlogs solely to reduce lag without approved data-loss acceptance.
- MUST NOT claim root cause from correlation alone.

## SHOULD
- Include decision trees and stop/escalation criteria in runbooks.
- Add regression tests for confirmed failure modes.

## Exceptions
Novel incidents may require deviation with incident-lead approval and recorded rationale.

## Verification
Review runbooks, incident records, position evidence, corrective tests, and post-incident reconciliation.