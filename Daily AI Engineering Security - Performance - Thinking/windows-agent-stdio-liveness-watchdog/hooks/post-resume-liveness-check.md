# Hook: Post-Resume Liveness Check

## Trigger
After Windows resume, or when the host records sustained child unresponsiveness/CPU anomaly.

## Preconditions
The host can supply CPU samples and a protocol-progress timestamp for the owned child process. Run from package root with Python 3.10+.

## Action
1. Wait at least `post_resume_grace_seconds`.
2. Build a state JSON document containing recent samples, last progress time, resume time when known, and restart attempts.
3. Execute:

```bash
python scripts/liveness_watchdog.py --config config/watchdog.json --state state.json
```

4. Treat exit `3` as a restart recommendation, not as permission to kill arbitrary processes. The host must confirm process ownership and use its normal safe restart mechanism.
5. After restart, require a new protocol handshake/progress event before marking recovery complete.

## Expected result
Healthy children return exit `0`; ambiguous anomalies return `2`; sustained hot+stale children within retry budget return `3`.

## Failure behavior
Invalid input (`64`) blocks automated recovery. Restart-budget exhaustion blocks further automatic restart and escalates. Never loop indefinitely.

## Blocking
Yes for claims of successful recovery; the hook must have valid evidence and post-restart protocol progress.
