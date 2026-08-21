# Hook: Startup Store Budget Check

## Trigger
Before or during startup initialization of local SQLite stores.

## Preconditions
A store inventory JSON identifies criticality and configured size/time thresholds. Health probing is read-only.

## Action
Run:

```bash
python scripts/store_health_guard.py --inventory store-inventory.json
```

## Expected result
Critical stores report healthy. Non-critical telemetry stores either pass configured thresholds or are explicitly marked `degrade`/`isolate` for startup.

## Failure behavior
- Critical unhealthy store: block normal startup and enter recovery path.
- Non-critical over-budget/unhealthy store: do not repeatedly consume the global startup deadline; isolate telemetry if host policy supports degraded startup.
- Invalid inventory: block automation and report configuration error.

## Blocks completion
Yes for critical-store failures or invalid classification. No for a correctly isolated non-critical telemetry store.