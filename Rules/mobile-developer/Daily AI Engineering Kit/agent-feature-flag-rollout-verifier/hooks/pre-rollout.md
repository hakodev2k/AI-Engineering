# Hook: Pre-Rollout Validation

## Trigger
Immediately before a rollout stage is considered ready.

## Preconditions
A rollout contract exists and the package root is known.

## Action
Run:

`python scripts/validate-rollout.py --contract <contract.json> --policy config/rollout-policy.yaml`

Then execute repository-specific build/tests declared in the contract's evidence section.

## Expected result
Validator exits 0, all required checks are present, requested exposure obeys policy, and required test commands succeed.

## Failure behavior
Exit non-zero blocks rollout. Preserve validator/test output and mark the stage `blocked`. Retry only transient tool failures, maximum twice.

## Blocking
Yes.
