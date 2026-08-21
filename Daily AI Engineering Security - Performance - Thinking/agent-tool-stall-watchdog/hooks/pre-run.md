# Hook — Pre Run Watchdog Validation

## Trigger
Immediately before a scheduled or headless agent process starts.

## Preconditions
The runner knows the global timeout, silence timeout, grace period, and whether retry is safe.

## Action
Validate:
- `0 < silence_timeout < global_timeout`;
- grace period is positive and materially smaller than remaining global budget;
- retry limit is bounded;
- automatic retry is disabled unless `safe_to_retry=true`;
- diagnostic output path is writable;
- the final platform/CI timeout remains larger than the watchdog global timeout.

Launch only through:
```bash
python scripts/stall_watchdog.py --global-timeout 600 --silence-timeout 90 --grace 5 --record run.json -- <agent command...>
```

## Expected result
Configuration passes deterministic validation and the child starts under watchdog control.

## Failure behavior
Block the run on invalid thresholds or unwritable diagnostics. Do not silently substitute unlimited values.

## Blocking
Yes.