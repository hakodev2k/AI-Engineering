# Hook: Preflight Latency Baseline

## Trigger
Before any watchdog timeout, heartbeat, retry, or reconnect policy change.

## Preconditions
Representative trace corpus exists; phase and outcome fields are populated; production secrets are excluded.

## Action
Run the profiler using the current policy and save its report as immutable baseline evidence.

## Script/command
```bash
python scripts/watchdog_profiler.py traces.jsonl --config config/watchdog.example.json --json-out baseline.json
```

## Expected result
Report includes per-phase counts/quantiles, timeout-abort clustering, false-abort candidates, retry/token amplification, and policy violations.

## Failure behavior
Block optimization claims until trace/schema errors are corrected. Do not substitute anecdotal timing.

## Blocking
Yes. Performance tuning without a valid baseline cannot be marked complete.
