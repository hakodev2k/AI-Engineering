# Skill — Verify Parallel Tool Output Cardinality

## Purpose
Guarantee that every tool call emitted in a model turn has exactly one terminal orchestration disposition before the next model request is sent.

## Trigger
Run after tool-call parsing, after each terminal tool event, after resume hydration, before session persistence, and before the next provider request.

## Inputs
Turn ID, emitted call IDs, tool names, execution status, approval status, guardrail result, generated output IDs, persisted output IDs, provider-sent output IDs.

## Preconditions
All emitted tool calls for the turn MUST be registered before any completion check. Call IDs MUST be stable and unique within the turn.

## Required context
Only the current turn ledger and persisted resume state are required; unrelated conversation history is not.

## Allowed tools
Read-only session/state store, deterministic ledger validator, framework instrumentation, and regression tests.

## Constraints
- MUST preserve safe parallel execution.
- MUST NOT fabricate missing tool output payloads.
- MUST distinguish generated, persisted, and sent states.
- MUST NOT treat approval rejection/cancellation as success; they are terminal dispositions with explicit type.

## Procedure
1. Register all call IDs emitted by the model before dispatch.
2. For each call, track `emitted -> started? -> terminal disposition -> persisted? -> sent?`.
3. Accept terminal dispositions: `success`, `error`, `rejected`, `cancelled`, or `interrupted` only when the orchestration protocol explicitly supports deferred resume.
4. Reject duplicate terminal dispositions for a call ID.
5. Before persistence, assert every non-deferred call has exactly one terminal record.
6. On resume, reconcile persisted records against the expected call set; do not infer `sent=true` from merely generated/persisted output.
7. Before the next model/provider request, assert that every call requiring a tool result has exactly one output/disposition included in the outgoing request or already acknowledged by provider state.
8. If incomplete, run one reconciliation attempt using authoritative persisted records and provider conversation metadata.
9. If still incomplete, block the next model call and emit an integrity report.

## Decision points
- Missing terminal record -> repair once, then block.
- More than one terminal record -> block immediately.
- Rejected/cancelled call encoded as successful -> block.
- Output exists locally but not sent -> include it unless provider state proves it was already acknowledged.
- Parallel calls all complete -> continue without serializing.

## Expected output
Decision (`complete`, `repair`, `block`), expected call count, terminal count, missing IDs, duplicate IDs, generated/persisted/sent mismatches, and remediation evidence.

## Metrics
Orphan rate, duplicate disposition rate, reconciliation rate, provider 4xx errors caused by missing results, added verification latency, parallel throughput.

## Verification
Use fixtures covering normal parallel success, mixed approval and immediate tools, guardrail trip, cancellation, resume hydration, and multiple structured-output calls.

## Failure handling
Do not call the model with a structurally incomplete turn. Preserve the ledger, emit evidence, and escalate after one reconciliation attempt.

## Stop conditions
Stop successfully when the turn is structurally complete. Stop with block after one failed reconciliation or any irreconcilable duplicate/conflicting terminal state.
