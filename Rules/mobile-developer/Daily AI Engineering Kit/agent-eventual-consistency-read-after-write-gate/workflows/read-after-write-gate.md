# Read-After-Write Consistency Gate Workflow

## Trigger
An acknowledged write is followed by a missing, stale, or conflicting read, or a change touches an eventually consistent write/read path.

## Entry conditions
Write identity and intended read endpoint are known. Read verification is non-destructive.

## Inputs
Write response, entity ID, correlation ID, expected value, optional version/ETag, read URL, logs/traces, repository context.

## Stages
1. **Context — Consistency Investigator**: locate writer, propagation path, projection/cache/replica, and reader. Produce facts and open hypotheses.
2. **Evidence — Consistency Investigator**: correlate the write with outbox/event/consumer/cache/replica evidence. Classify the likely boundary.
3. **Contract — Consistency Investigator**: create a request matching `examples/sample-request.json`; include minimum write version when supported.
4. **Checkpoint A**: reject destructive reproduction, repeated mutations, missing correlation identity, or unsupported production access.
5. **Verify — Verification Agent**: run `python scripts/consistency_gate.py --request <request.json> --output consistency-result.json`.
6. **Review — Verification Agent**: inspect all attempts and confirm output matches `schemas/result.schema.json` conceptually and policy limits.
7. **Checkpoint B**: `verified` completes; `unverified` returns once to investigation with preserved evidence.
8. **Recovery pass — Consistency Investigator**: refine one hypothesis using new evidence. No more than one investigation re-entry.
9. **Final verify — Verification Agent**: one final bounded gate execution. No autonomous loop beyond this point.
10. **Complete or escalate**: produce verified evidence or an unverified escalation with classification, missing evidence, and recommended human action.

## Retry rules
The script performs at most 4 read attempts. Retryable observations include configured stale values, 404/409/412/425/429 and transient 5xx. Preserve every attempt. The workflow permits one investigation re-entry and one final gate run. Repeated failure stops.

## Approval points
Stop for human approval before production mutations, cache flushes, consumer checkpoint changes, infrastructure/routing changes, consistency-model changes, destructive compensation, or security/permission changes.

## Failure paths
- **Validation failure**: stop; correct the request contract.
- **Permission failure**: stop; report missing read permission; never escalate privileges automatically.
- **Transient read failure**: bounded script retry.
- **Persistent stale/missing state**: investigate once, reverify once, then escalate.
- **Tool/environment failure**: preserve command/error; do not report verified.

## Produced artifacts
Investigation finding, request JSON, `consistency-result.json`, and remaining-risk note.

## Definition of Done
The read contract is verified against the acknowledged write/version within policy, evidence is preserved, no unintended mutation occurred, approvals were respected, and no blocking risk remains; otherwise status is explicitly unverified.
