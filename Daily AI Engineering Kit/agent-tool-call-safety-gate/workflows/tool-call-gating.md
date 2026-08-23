# Workflow: Tool Call Gating

## Trigger

An AI agent proposes a tool invocation that can access repository/system state.

## Entry conditions

The tool call has not executed and its exact arguments can be serialized.

## Inputs

Tool, operation, arguments, requester, environment context, policy, optional approval.

## Stages

1. **Materialize request — owning agent**: resolve exact arguments and assign request ID.
2. **Evaluate — Policy Evaluator**: run `scripts/gate_tool_call.py`.
3. **Decision checkpoint**:
   - `deny`: stop and preserve evidence.
   - `invalid`/`error`: stop and repair deterministic inputs/system.
   - `approval_required`: stop before execution and request human approval.
   - `allow`: continue.
4. **Approval re-evaluation — Policy Evaluator**: when approved, re-run the identical request with the bound approval. Any argument/context change creates a new request.
5. **Execute — owning tool adapter**: execute exactly once with the gated tool, operation, and arguments.
6. **Collect evidence — owning agent**: preserve decision, tool result, changed paths/output, and exit status.
7. **Verify — Verification Agent**: compare executed request to authorization and run task-specific deterministic checks.
8. **Complete — parent workflow**: distinguish executed from verified-successful status.

## Produced artifacts

Request JSON, gate decision JSON, optional approval record, tool result/evidence, verification record.

## Checkpoints

Human approval is mandatory whenever status is `approval_required`. A `deny` rule cannot be approved through this workflow.

## Retry rules

- Gate parse/validation defect: maximum 1 retry after correcting deterministic input.
- Transient tool transport failure after authorization: maximum 2 retries only if the tool contract guarantees the failed attempt produced no side effect; otherwise stop for reconciliation.
- Verification failure: maximum 2 implementation/fix cycles in the parent workflow.
- Approval rejection/expiration is not retryable; obtain a new explicit decision only after reviewing the current request.

Preserve request, decision, tool result, and verification evidence across every retry.

## Failure paths

Permission failures, ambiguous side-effect state, policy errors, approval mismatch, or evidence mismatch are blocking. Escalate rather than increasing privileges or guessing whether execution occurred.

## Definition of Done

- Exact call was gated before execution.
- Policy produced an explicit decision.
- Required approval, if any, was valid and request-bound.
- Execution matched gated arguments.
- Parent task verification passed after mutations.
- Retry bounds were not exceeded.
- No blocking failure or unresolved execution ambiguity remains.