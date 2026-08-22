# Workflow: Stream-to-Commit Integrity

## Trigger
Any streamed tool call, stream interruption, session resume with outstanding tool calls, or retry after uncertain transport failure.

## Goal
Ensure transport fragments cannot produce a side effect until completeness, authorization, idempotency, and execution outcome are deterministic.

## Inputs
Stream deltas, provider terminal signal, finalized tool schema, risk classification, authorization decision, idempotency key, and postcondition mechanism.

## Baseline
Before changing runtime behavior, replay at least one valid complete call and all known incident fixtures. Record whether each call was executed, denied, silently changed, duplicated, or left the session unrecoverable.

## Stages
1. **Observe** — accumulate fragments while state remains `partial`; no execution.
2. **Complete** — accept provider terminal evidence and freeze call ID/name/arguments.
3. **Validate** — parse finalized JSON and validate schema.
4. **Authorize** — evaluate finalized identity/arguments against tool policy.
5. **Prepare side effect** — create/verify idempotency key and integrity hash.
6. **Execute** — move to `executing`; record durable start when supported.
7. **Commit/reconcile** — verify result/postcondition. If outcome is uncertain, move to `unknown` and reconcile external state before any retry.
8. **Verify** — independent verifier runs adversarial regression matrix.

## Responsible agent
Runtime/implementation agent for stages 1–7; `subagents/integrity-verifier.md` for stage 8.

## Tools
Stream logger, tool schema validator, `scripts/tool_call_gate.py`, sandbox/mock executors, project test runner.

## Outputs
Integrity envelope, decision/reason code, integrity hash, execution record, reconciliation evidence, and verification matrix.

## Checkpoints
- C1 partial state cannot invoke executor.
- C2 finalized call passes schema and authorization.
- C3 side effects have idempotency identity.
- C4 execution outcome is success/failed/unknown with evidence.
- C5 unknown outcomes reconcile before retry.

## Metrics
Incomplete calls executed, invalid calls executed, duplicate effects, reconciliation coverage, valid-call false-block rate.

## Retry policy
At most two repair attempts for model-generated invalid calls. Transport retry is allowed only if execution is proven not started. Unknown side-effect outcomes are reconciled, not blindly retried.

## Stop conditions
Complete after C1–C5 and independent verification pass. Stop with failure after two repair attempts, unavailable outcome evidence for a high-impact action, or any path that executes before completion/authorization.

## Failure path
Return a structured error to the orchestrator, preserve sanitized lifecycle evidence, disable unattended execution for the affected high-impact path, and require human review if reconciliation cannot prove external state.

## Definition of Done
Implemented: lifecycle states and gate enforce all preconditions. Measured: baseline and adversarial results recorded. Verified: zero partial/invalid executions and zero duplicate side effects across tested recovery paths.
