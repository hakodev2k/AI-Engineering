# Hook: Pre-Tool Permission Check

## Trigger
Immediately before unattended tool dispatch.

## Preconditions
A normalized policy JSON file exists and the tool call has a risk classification.

## Action
Run `python scripts/permission_audit.py --input <policy.json>` and inspect the exit code.

## Expected result
Exit `0` only when the effective decision is `allow` with no blocking ambiguity. Exit `2` for deny and `3` for indeterminate/conflict requiring review.

## Failure behavior
Do not dispatch the tool. Persist the audit result and hand off to Permission Reviewer or a human operator.

## Blocks completion
Yes for risky mutations. For safe reads, indeterminate results still require explicit operator choice; the hook never auto-bypasses policy.