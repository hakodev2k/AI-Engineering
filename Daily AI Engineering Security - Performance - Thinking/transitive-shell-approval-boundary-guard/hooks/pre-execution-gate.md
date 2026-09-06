# Hook: Pre-execution Approval Gate

## Trigger
Immediately before an agent-originated shell, interpreter, or package-runner command executes.

## Preconditions
Python 3 is available; policy exists at `config/policy.json`; hook input can provide command and cwd as JSON.

## Action
Pass the event to the deterministic guard and block execution when the guard exits non-zero.

## Script / command
```sh
python3 scripts/approval_guard.py --policy config/policy.json --event-json "$AGENT_TOOL_EVENT"
```

Expected event shape:
```json
{"command":"bash scripts/build.sh","cwd":"/workspace/project"}
```

## Expected result
Exit `0` with JSON decision `allow`; exit `10` for `review`; exit `20` for `block`; exit `30` for invalid input/internal policy error. A host SHOULD treat every non-zero result as execution-blocking and surface `review` to a human-capable approval path.

## Failure behavior
Malformed event, missing policy, unreadable referenced script, or unsafe path resolution fails closed. The hook MUST NOT fall back to running the command directly.

## Blocks completion?
Yes for high-risk or unresolved execution. Human approval may authorize an explicitly reviewed action, but approval MUST be scoped to the inspected command/script digest and MUST NOT disable the guard globally.
