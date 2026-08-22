# Hook: Pre-Rollout Validation

## Trigger
Immediately before planning or executing any rollout step.

## Preconditions
Flag contract JSON is available and target environment is known.

## Action
Run:

`python scripts/validate-flags.py <flag-contract.json> --environment <environment> [--approval-file <approval.json>]`

Then run:

`python scripts/scan-feature-flags.py <repository-root> --json-out <evidence-path>`

## Expected result
Validator exits 0 and scanner evidence is persisted.

## Failure behavior
Validation exit code 2 blocks rollout. Missing files/tool errors block rollout. Transient repository/provider reads may be retried twice outside the script.

## Blocking
Yes.
