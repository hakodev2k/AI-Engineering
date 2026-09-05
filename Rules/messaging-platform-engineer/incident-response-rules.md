# Incident Response Rules

## Purpose
Provide disciplined response to message loss, duplication, backlog, broker failure, or consumer outage.

## Scope
Production incidents involving brokers, producers, consumers, schemas, routing, storage, and dependencies.

## MUST
- Responders MUST identify affected topics/queues, consumer groups, partitions, offsets, and deployment versions before broad conclusions.
- Mitigation MUST prioritize preventing further loss or harmful duplication.
- Incident diagnosis MUST use broker state, logs, metrics, traces, and deployment history.
- Significant incidents MUST record impact, timeline, mitigation, causal evidence, and corrective actions.
- Replay, offset reset, topic deletion, or destructive recovery MUST require the appropriate human approval.

## MUST NOT
- MUST NOT delete queues, topics, offsets, or retained evidence merely to clear symptoms.
- MUST NOT claim root cause from correlation alone.
- MUST NOT continue an unsafe replay when stop conditions are met.

## SHOULD
- Add regression tests or platform guardrails for confirmed failure modes.

## Exceptions
Emergency actions may follow incident authority but MUST remain auditable.

## Verification
Review incident records, broker evidence, recovery actions, approvals, and follow-up tests.