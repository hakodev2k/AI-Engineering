# Hook: Post Task Verification

## Trigger
After task execution and before declaring success.

## Preconditions
Execution evidence, approvals, configured scopes, and resulting repository/runtime state are available.

## Action
1. Run `python scripts/verify-evidence.py --policy config/policy.json --evidence <evidence.json>`.
2. Have `subagents/permission-verifier.md` compare planned and effective permissions.
3. Confirm temporary capabilities are revoked or expired where supported.
4. Confirm no unauthorized high-risk invocation occurred.

## Expected result
Validator exits 0 and verifier status is `verified`.

## Failure behavior
Mark the task `failed` or `blocked`; preserve evidence and unresolved discrepancies. Do not report successful completion.

## Blocking
Yes.
