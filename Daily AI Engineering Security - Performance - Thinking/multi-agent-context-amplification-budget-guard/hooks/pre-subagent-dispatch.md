# Hook: Pre-Subagent Dispatch

## Trigger
Immediately before a child agent or parallel child set is created.

## Preconditions
Dispatch plan includes parent tokens, child list, child model limits, expected turns, and required context classification.

## Action
Run:
`python scripts/context_amplification_guard.py --plan <dispatch-plan.json> --max-amplification 3.0 --max-child-tokens 120000`

## Expected result
Exit 0 only for `allow`; exit 3 for `reduce-context` or `block-fanout`; exit 2 for invalid input.

## Failure behavior
Do not dispatch. Reduce optional context or fan-out, then retry within bounded workflow limits.

## Blocking
Yes.
