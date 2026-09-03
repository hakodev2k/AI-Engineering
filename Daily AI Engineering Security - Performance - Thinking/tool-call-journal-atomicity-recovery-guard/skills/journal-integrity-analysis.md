# Skill: Journal Integrity Analysis

## Purpose
Determine whether persisted tool-call state is safe to resume and select the correct recovery path without inventing execution outcomes.

## Trigger
Before session resume/replay, after runtime/gateway restart, after event-drop warnings, or when a tool call has no matching result.

## Inputs
Persisted journal/JSONL, tool-call IDs, tool names, side-effect classification, `config/policy.json`, and any authoritative external state that can confirm execution.

## Preconditions
The journal being checked MUST be the authoritative persisted history for the resume target. External reconciliation sources MUST be read-only unless human approval permits repair.

## Required context
For each orphan call: tool name, arguments if safely available, idempotency/side-effect class, timestamp, runtime generation, and whether the tool process may have completed.

## Allowed tools
Read-only journal inspection, external status/search APIs, audit logs, `scripts/tool_journal_guard.py`, and deterministic checksums/IDs.

## Constraints
Never synthesize a successful output. Never treat missing response as proof of failure. Never blindly retry a non-idempotent or unknown side-effect call.

## Procedure
1. Scan the journal for orphan calls, orphan outputs, and duplicate call/output IDs.
2. If no invariant violation exists, mark resume preflight clear.
3. For every orphan call, classify the tool as read-only/idempotent/non-idempotent/unknown.
4. Record facts separately from assumptions: persisted request exists; result absent; execution outcome unknown unless external evidence proves otherwise.
5. Reconcile against an authoritative external system when the action could have side effects.
6. If execution is proven complete, persist the real observed terminal result/reference through the host's supported repair path.
7. If proven not executed, persist an explicit aborted/not-executed marker if policy allows.
8. If outcome remains unknown, keep resume blocked and escalate; do not retry automatically.
9. Re-run the checker after repair and require zero orphan/duplicate violations.

## Decision points
- Read-only/idempotent call with known safe retry semantics: a controlled retry MAY be considered by the host after recording the interrupted attempt.
- Non-idempotent/unknown call: external reconciliation is mandatory before retry.
- Orphan output without request: quarantine journal and rebuild from authoritative event history; do not attach it heuristically.
- Duplicate call/output IDs: treat as corruption until ordering and identity are resolved.

## Expected output
Facts, invariant violations, side-effect classification, reconciliation evidence, recovery action, remaining uncertainty, and verification status.

## Metrics
Orphan rate, recovery time, reconciliation success rate, duplicate side effects, blocked corrupt resumes, and unsupported outcome claims.

## Verification
Resume is verified safe only when the deterministic checker reports zero violations and recovered terminal status is backed by durable or external evidence.

## Failure handling
Maximum reconciliation attempts: 2. Preserve evidence and escalate unresolved indeterminate state.

## Stop conditions
Stop when journal invariants pass and recovery evidence is sufficient, or when 2 reconciliation attempts fail and human/operator review is required.
