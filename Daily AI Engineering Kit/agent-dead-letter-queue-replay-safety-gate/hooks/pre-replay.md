# Hook: Pre-replay Safety Gate

**Trigger:** immediately before any dry-run or real replay execution.

**Preconditions:** replay plan exists and references the exact intended message set.

**Action:**

```bash
python scripts/replay_guard.py --plan <plan.json> --policy config/replay-policy.json --out .dlq-replay/guard.json
```

**Expected result:** exit code 0 and `status: pass`.

**Failure behavior:** block replay, preserve guard output, and return findings to Replay Planner. Do not widen message scope or increase retry limits automatically.

**Blocks execution:** yes.
