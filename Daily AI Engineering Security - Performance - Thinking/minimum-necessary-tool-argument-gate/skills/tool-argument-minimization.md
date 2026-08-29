# Skill: Tool Argument Minimization

## Purpose
Reduce unnecessary sensitive data in outbound agent tool calls while preserving required task semantics.

## Trigger
Run before any tool invocation that crosses a process, tenant, network, vendor, telemetry, or persistence boundary.

## Inputs
Tool name, proposed argument object, tool schema, configured policy, trust-boundary classification, and task-required fields.

## Preconditions
The proposed call has not yet been transmitted. Policy is loaded from a trusted local source. The original request is retained only in protected local memory/logging consistent with organizational policy.

## Required context
User goal, tool contract, required identifiers, authorization constraints, side-effect classification, and whether a human approval is already required.

## Allowed tools
Local deterministic validation, policy lookup, secret/PII detection, schema validation, and a bounded semantic reviewer for ambiguous free-text fields.

## Constraints
- MUST prefer deterministic rules for known fields.
- MUST NOT fabricate identifiers, credentials, account numbers, or authorization values.
- MUST NOT remove data required to authenticate or correctly target an explicitly authorized operation.
- MUST require review if a transformation can change a financial, permission, production, legal, or irreversible action.

## Procedure
1. Identify the destination trust boundary.
2. Record a baseline count of fields and sensitive matches.
3. Resolve the tool policy and allowed fields.
4. Reject or quarantine fields not permitted by policy.
5. Apply configured transformations: keep, drop, mask PII, or truncate.
6. Detect known secret-bearing field names regardless of value format.
7. Revalidate the sanitized arguments against the tool contract.
8. Compare sanitized arguments with the task's minimum required data.
9. If ambiguity remains, mark `review_required`; do not transmit.
10. Emit a structured minimization report and the sanitized argument object.

## Decision points
- Unknown tool: review by default.
- Detected secret in a non-required field: drop and block transmission of original.
- Required secret field: keep only when the trusted tool contract explicitly requires it and policy authorizes the destination.
- Free text containing PII: mask only if task semantics remain valid; otherwise review.

## Expected output
Sanitized arguments plus a report containing removed fields, transformed fields, sensitive matches, review status, and policy decision.

## Metrics
Sensitive fields/call, sensitive characters/call, task-validity rate, review rate, false-positive redaction rate, and blocked secret transmissions.

## Verification
Replay a representative corpus through baseline and gated paths. Confirm lower exposure and equivalent required tool behavior for approved cases.

## Failure handling
If parsing, policy lookup, schema validation, or necessity determination fails, block external transmission and escalate.

## Stop conditions
Stop when arguments are policy-compliant and verified, when human review is required, or after two unsuccessful rewrite attempts.
