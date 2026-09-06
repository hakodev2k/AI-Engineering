# Hook: Pre-Action Feasibility Gate

## Trigger
Immediately before the executor sends a state-changing GUI action.

## Preconditions
A structured feasibility JSON record exists and references a fresh observation.

## Action
Run `python scripts/feasibility_gate.py <record.json>` and parse its JSON decision.

## Expected result
`ACT` only when required preconditions are evidenced, no blocking conflicts exist, retry limits are respected, and required approval is present. Otherwise return `REVIEW` or `STOP` with blocking reasons.

## Failure behavior
Malformed input or unknown states return a non-zero exit code and block action. Do not bypass the hook when the model claims confidence.

## Blocking
Yes. Any non-`ACT` result blocks the proposed state-changing action.
