# Hook: Post-Iteration Liveness Check

## Trigger
After every autonomous iteration and before automatic continuation.

## Preconditions
Iteration events are written as JSON and include the current no-progress streak and hypothesis ID.

## Action
Run `python scripts/liveness_gate.py --input <iteration.json>`.

## Expected result
Exit `0` means measurable progress; exit `2` means warning/recovery required; exit `3` means stop autonomous continuation.

## Failure behavior
Do not continue automatically. Preserve the last verified state and hand off to Liveness Verifier or a human operator.

## Blocks completion
Yes when mandatory acceptance criteria remain unsatisfied or the stop threshold has been reached.