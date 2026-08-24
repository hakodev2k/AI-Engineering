# Skill — Approval Envelope Verification

## Purpose
Prove that an approval decision is bound to the exact tool identity and arguments that execute.

## Trigger
Any human- or policy-approved tool call, especially commands, writes, deployments, payments, outbound messages, credentials, or MCP/ACP operations.

## Inputs
Raw tool arguments, parsed arguments, validated/transformed arguments, tool identity, approval event, execution payload.

## Preconditions
The host can intercept the payload immediately before approval and immediately before execution.

## Required context
Tool schema, deterministic transforms, delegation chain, and approval policy.

## Allowed tools
Read-only inspection, schema validators, `scripts/approval_input_guard.py`, test runners.

## Constraints
Never execute the target side effect during verification. Never log raw secrets.

## Procedure
1. Capture whether raw input is present, absent, malformed, or defaulted; do not collapse these states.
2. Parse and schema-validate the payload. On parse loss, stop and block.
3. Apply all deterministic pre-execution transforms before approval.
4. Build `{tool, arguments}` and canonicalize with stable JSON key ordering.
5. Compute SHA-256 and store the digest with the approval decision.
6. Immediately before execution, rebuild the envelope from the actual payload.
7. Recompute the digest and compare in constant semantic form.
8. If tool identity, arguments, or transform version changed, invalidate approval.
9. For delegation, verify the visible approval identifies the inner side-effecting tool rather than only the delegate wrapper.
10. Record pass/block evidence without secret values.

## Decision points
- Parse/default ambiguity: block.
- Post-approval mutation: re-approve.
- Nested-call identity ambiguity: block.
- Exact canonical match: allow execution to proceed to the host's normal authorization layer.

## Expected output
ALLOW/BLOCK, approval digest, execution digest, reason code, and sanitized audit metadata.

## Metrics
Mismatch rate, parse-loss blocks, re-approval count, coverage of high-impact calls.

## Verification
Run positive equality tests plus malformed input, mutation, and tool-identity mismatch tests.

## Failure handling
Maximum one re-canonicalization attempt after deterministic normalization. Persistent mismatch escalates to human review.

## Stop conditions
Stop on exact verified match or any unresolved ambiguity; never loop waiting for a payload to become safe.
