# Hook: Pre-Agent Tool Policy Check

## Trigger
Immediately after tool registration/policy resolution and before the agent receives its first model turn; repeat after tool-policy or registry refresh.

## Preconditions
A JSON snapshot exists with policy presence, known tools, provider-visible tools, runtime-executable tools, and mode.

## Action
Run:

```bash
python scripts/tool_policy_gate.py effective-tools.json --config config/policy.json
```

## Expected result
Exit code `0` and `decision=pass`. The normalized allowed set contains every exposed tool; denied tools are absent.

## Failure behavior
Exit code `2` or `3` blocks agent activation for any session that could gain broader capability. Preserve the snapshot and command output for diagnosis.

## Blocks completion
Yes. The hook must not be downgraded to warning-only for high-impact tools.
