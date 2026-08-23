# Hook: Post-Run Yield Regression Gate

## Trigger
After a benchmark or representative agent run.

## Preconditions
A complete trace exists and a latency threshold has been defined from baseline/SLO.

## Action
```bash
python scripts/analyze_tool_yields.py trace.jsonl --max-yield-p95-ms "$MAX_YIELD_P95_MS" --json
```

## Expected result
Exit `0` when trace is valid and p95 yield latency is within threshold. Exit `2` on threshold regression. Exit `1` on invalid trace/input.

## Failure behavior
Persist report and mark performance verification failed. Do not weaken the threshold automatically.

## Blocking
Blocks a claim that the optimization is verified. Production rollout policy may additionally require this hook to block deployment.