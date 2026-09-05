# Hook: Post-Tool Contract Check

## Trigger
After an MCP/tool event is normalized by an adapter, before the planner records completion.

## Preconditions
Raw and normalized fields are available.

## Action
Append the event to a JSONL trace and run the verifier for test/release gates; production integrations can apply the same normalization function inline.

## Command
`python scripts/verify_tool_outcome.py <events.jsonl>`

## Expected result
Exit 0.

## Failure behavior
Exit 4 blocks completion/rollout and identifies the contradictory event. Exit 1 blocks because evidence is malformed.

## Blocks completion
Yes for consequential actions and release conformance tests.