# Hook: Pre Poll Budget Check

## Trigger
Before a model-visible `wait`, `wait_agent`, `list_agents`, or status poll.

## Preconditions
Current task poll count, consecutive no-change count, context/cache token estimate, agent lifecycle status and configured policy are available.

## Action
1. If new state is already available, deliver it without an extra polling turn.
2. If the model-visible poll budget is exhausted, block and escalate lifecycle handling.
3. If consecutive no-change polls exceed policy, increase backoff up to the configured maximum.
4. If cached-token estimate exceeds the no-change cap, suppress the model turn and wait for a state-changing event unless doing so would violate a correctness deadline.
5. Never terminate an agent solely from elapsed time; require lifecycle evidence.

## Script/command
Use `python scripts/remeter_profiler.py <recent-trace.jsonl> --policy config/policy.json` during validation and regression runs.

## Expected result
No unbounded model-visible polling; policy metrics remain within budget while state changes are preserved.

## Failure behavior
Block further automatic model-visible polls and require conservative fallback or operator review. Do not discard required context.

## Blocking
Yes for budget/quality violations; no for ordinary backoff when safe lifecycle evidence exists.
