# Incident Handoff and Escalation

## Purpose
Transfer suspicious activity from SOC investigation to incident response or another team without losing evidence, urgency or ownership.

## When to use
Use when incident criteria, specialist needs or organizational boundaries are reached.

## Inputs
Case record, severity, timeline, affected entities, evidence, containment status, open hypotheses and required actions.

## Context to inspect
Know escalation matrix, on-call contacts, severity definitions, business ownership and communication channels.

## Core knowledge
A handoff is complete only when the receiving owner acknowledges responsibility and has enough context to act. Escalation should communicate uncertainty explicitly.

## Procedure
1. Confirm escalation trigger and urgency.
2. Summarize observed facts and confidence.
3. State affected identities/assets and business criticality.
4. Provide concise timeline and evidence references.
5. Record actions already taken and their results.
6. Identify untested hypotheses and known gaps.
7. Recommend immediate next actions without overstating certainty.
8. Contact the correct responder through approved channel.
9. Obtain acknowledgement and record ownership transfer.
10. Continue monitoring until handoff is accepted when risk is active.

## Decision points
Escalate before full certainty when potential impact is high and delay increases harm. Use synchronous contact for critical incidents; asynchronous tickets are insufficient for urgent compromise.

## Common failure patterns
Dumping raw alerts; no timeline; ambiguous owner; waiting for perfect proof; omitting containment actions; failing to record acknowledgement.

## Verification
Receiving team confirms ownership and can reproduce the current assessment from supplied evidence.

## Expected output
An acknowledged handoff with severity, facts, scope, uncertainty and next actions.

## Stop conditions
Invoke higher escalation when no owner responds within severity-defined limits or immediate containment authority is unclear.