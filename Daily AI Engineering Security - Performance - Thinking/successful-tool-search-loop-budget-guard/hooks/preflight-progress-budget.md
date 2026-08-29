# Hook: Preflight Progress Budget

## Trigger
Before enabling deferred/dynamic tool discovery in an agent workflow.

## Preconditions
A representative trace format exists and the workflow owner has defined completion criteria.

## Action
Validate finite budgets for total discovery calls, consecutive stagnant searches, repeated fingerprints, and elapsed time. Run the analyzer against a captured baseline or fixture.

## Script/command
`python scripts/tool_loop_guard.py TRACE.jsonl --max-searches 24 --max-stagnant 6 --max-repeats 3 --max-seconds 180 --json`

## Expected result
Healthy traces exit 0. A trace exceeding any progress budget exits 2 with a machine-readable verdict.

## Failure behavior
Block rollout when budgets are missing, unbounded, or the analyzer cannot parse the trace. Do not replace the hook with a prose-only warning.

## Blocks completion
Yes.
