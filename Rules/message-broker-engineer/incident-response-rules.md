# Incident Response

## Purpose
Restore messaging safely while preserving evidence and controlling secondary damage.

## Scope
Broker outages, lag incidents, data loss risk, poison messages, saturation, and security events.

## MUST
- Incident actions MUST prioritize safety, service restoration, and preservation of diagnostic evidence.
- Conclusions MUST use available metrics, logs, traces, broker state, and message-flow evidence.
- High-risk actions such as data deletion, bulk replay, quorum changes, or security weakening MUST require authorized human approval.

## MUST NOT
- MUST NOT purge queues or reset consumer progress merely to clear alerts.
- MUST NOT conceal uncertainty in suspected loss or duplication.

## SHOULD
- Prefer reversible containment before invasive remediation.

## Exceptions
Emergency authority must be explicit and actions recorded.

## Verification
Review incident timeline, commands/config diffs, telemetry, reconciliation, and post-incident actions.