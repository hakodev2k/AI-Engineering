# Hook: Cache Regression Check
## Trigger
After changes to prompt assembly, memory, tool registry, provider adapter, or cache settings.
## Preconditions
Redacted comparable request samples exist; baseline quality fixtures exist.
## Action
Run `python scripts/prefix_drift_profiler.py <samples.json>` and compare cache-read ratio, stable-prefix bytes, tokens/task and TTFT with baseline.
## Expected result
No new avoidable early-prefix drift and no material cache/token regression beyond project thresholds.
## Failure behavior
Block performance sign-off; diagnose telemetry before declaring cache failure.
## Blocking
Yes for changes explicitly targeting token/cost/latency improvement.
