# Hook: Pre-Compaction Budget Gate

## Trigger
Immediately before an automatic compaction or compaction retry.

## Preconditions
A current JSONL telemetry trace and `config/policy.json` are available.

## Action
Run:
```bash
python scripts/compaction_guard.py --trace <trace.jsonl> --policy config/policy.json
```

## Expected result
Exit `0` permits normal continuation. Exit `3` requires the runtime to inspect the returned `decision` and MUST NOT blindly repeat compaction.

## Failure behavior
Exit `2` means invalid or missing telemetry and blocks automatic compaction until telemetry is repaired or a safe manual recovery path is selected.

## Blocking
Yes for `stop-and-recover`, invalid telemetry, and any compaction retry beyond the configured bound.