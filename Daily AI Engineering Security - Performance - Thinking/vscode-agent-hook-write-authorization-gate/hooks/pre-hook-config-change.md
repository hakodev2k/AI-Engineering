# Hook: Pre Hook-Configuration Change

## Trigger
Before an agent writes hook/custom-agent executable configuration.

## Preconditions
Proposed file is staged, workspace root and policy are known, approval state is explicit.

## Action
Run `python scripts/hook_policy_guard.py --file <staged-file> --workspace <workspace> --policy config/policy.json [--approved]`.

## Expected result
Exit 0 only when safe under policy. Exit 3 blocks or requires approval.

## Failure behavior
Parse errors and non-zero results block activation; log secret-free reason codes.

## Blocks completion
Yes.
