# Hook: Pre Tool Call Reuse Check

## Trigger
Before executing a tool that appears in `config/reuse-policy.json` as cacheable.

## Preconditions
Tool name, canonical arguments, scope identifier, current timestamp, and any prior result metadata are available.

## Action
1. Build the same canonical key used by `scripts/tool_reuse_profiler.py`.
2. Look up a prior result only within the same declared scope.
3. Confirm age is within the configured TTL.
4. Confirm the tool remains classified read-only.
5. Return the prior result only when all conditions pass; otherwise execute live and record a fresh digest.

## Script/command
Offline audit of traces:
```bash
python scripts/tool_reuse_profiler.py --trace <trace.jsonl> --policy config/reuse-policy.json
```

## Expected result
Exact same-scope, within-TTL read-only calls can be reused; all other calls execute live.

## Failure behavior
Any missing scope, invalid policy, ambiguous side-effect status, or stale result MUST fall back to live execution. Never widen scope automatically.

## Blocking
The hook blocks cache reuse when safety/freshness conditions are not proven; it does not block the underlying live read-only tool call.
