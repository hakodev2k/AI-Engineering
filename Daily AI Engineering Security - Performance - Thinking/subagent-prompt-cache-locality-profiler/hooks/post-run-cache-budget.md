# Hook — Post Run Cache Budget

## Trigger
After a representative multi-agent/fan-out run and before accepting an optimization or increasing fan-out.

## Preconditions
Usage telemetry has stable request IDs and includes input, cache creation, and cache read token fields. Dispatch group and child identity are assigned.

## Action
Run the profiler against the captured JSONL; when evaluating a change, provide the unchanged baseline JSONL as `--baseline`.

## Command
```bash
python scripts/cache_locality_profiler.py candidate.jsonl --thresholds config/thresholds.json --baseline baseline.jsonl
```

## Expected result
Exit `0`, no threshold violations, no quality regression, and a machine-readable report containing dispatch-level and summary metrics.

## Failure behavior
Exit `2`: block the claim because telemetry/config is invalid. Exit `3`: block fan-out expansion/optimization acceptance, preserve the report, and return to diagnosis. Do not make thresholds looser merely to pass the hook.

## Blocking
Yes for any claim that cache locality improved or that a new fan-out configuration is within budget. A runtime may continue under the prior known-good configuration while investigation proceeds.
