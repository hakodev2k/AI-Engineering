# Skill: Evaluate a Tool Call

## Purpose

Convert an agent's proposed tool action into a deterministic authorization decision before execution.

## When to use

Use immediately before every tool invocation covered by the safety policy, including repeated or retried calls.

## Inputs

- Proposed tool name and operation.
- Exact arguments that would be sent to the tool.
- Stable request ID.
- Requesting agent identity/role.
- Relevant environment/repository context.
- Current `config/policy.json`.
- Optional human approval record.

## Preconditions

- The real tool has not yet been invoked.
- The proposed arguments are fully materialized; no hidden interpolation occurs after the gate.
- Policy file is from the trusted repository/configuration source.

## Allowed tools

Read request/policy/approval files and execute `scripts/gate_tool_call.py`. No production mutation is needed for evaluation.

## Process

1. Serialize the exact proposed invocation to the tool-call contract.
2. Validate that the request ID is stable and unique for this invocation.
3. Run the gate without approval.
4. If status is `allow`, preserve the decision and hand off to the tool adapter.
5. If status is `deny`, stop. Record the matched rule and evidence. Do not reformulate the same dangerous operation to bypass policy.
6. If status is `approval_required`, present the exact request, rule, arguments, risks, and intended effect to the designated human owner.
7. If approval is granted, create a short-lived approval bound to the same request ID and rule ID.
8. Re-run the gate with the approval. Execute only if it returns `allow`.
9. If any arguments or security-relevant context change, discard the old authorization and return to step 1.
10. After execution, hand decision plus tool result to verification.

## Expected output

A gate decision matching `schemas/gate-decision.schema.json`, with status, matched rule, evidence, timestamp, and approval validity.

## Verification

The tool adapter must compare process exit code and decision status. Mutation workflows must retain evidence that the executed arguments equal the gated arguments.

## Failure handling

Invalid input or gate error is blocking. Fix deterministic input/configuration defects; do not bypass the gate. Approval failures are not transient retries.

## Stop conditions

Stop on deny, invalid input, gate error, rejected/expired approval, or any request mutation after authorization.