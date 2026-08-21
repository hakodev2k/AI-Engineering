# Hook: Pre-completion Gate

## Trigger
Immediately before emitting a final success summary or changing task state to completed/verified.

## Preconditions
A structured ledger exists with intended claims and evidence records; trusted policy is available.

## Action
Run `python3 scripts/completion_gate.py <ledger.json> --policy config/completion-policy.json`.

## Expected result
Exit 0 and `status=supported` for every intended high-confidence claim.

## Failure behavior
Exit 4 blocks unsupported claims and returns missing evidence by claim. Exit 2 blocks completion because the ledger/policy is invalid. The caller must obtain evidence or downgrade the claim/status.

## Blocking
Yes for claims covered by policy. The hook must not be bypassed by changing wording to an equivalent unsupported assertion.