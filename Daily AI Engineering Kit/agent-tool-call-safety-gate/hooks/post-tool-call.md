# Hook: Post Tool Call

## Trigger

Immediately after an allowed tool call returns, including a tool-level failure.

## Preconditions

The pre-tool gate decision and exact executed request are available.

## Action

1. Persist the request ID, matched rule, approval-valid flag, tool exit/result status, and changed resource identifiers in the parent workflow evidence store.
2. Compare executed tool/operation/arguments with the gated request. Any mismatch is a blocking verification failure.
3. For mutations, run the task-specific build/test/lint/security or state verification required by the parent workflow.
4. Hand all evidence to the Verification Agent when independent verification is required.

## Expected result

A traceable link from request → authorization → execution result → verification result.

## Failure behavior

Do not reinterpret a successful tool exit as verified success. On missing/mismatched evidence, stop further mutation and reconcile state before any retry.

## Blocking

Argument mismatch, missing authorization evidence, or ambiguous side effects block subsequent mutating calls.