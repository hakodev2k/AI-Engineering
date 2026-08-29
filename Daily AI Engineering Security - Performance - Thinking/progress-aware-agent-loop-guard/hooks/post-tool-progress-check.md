# Hook: Post-Tool Progress Check

## Trigger
Immediately after every tool result and before another model/tool iteration is scheduled.

## Preconditions
The caller can provide a JSONL trace or equivalent step record with tool name and arguments; errors/results and state fingerprints are strongly recommended.

## Action
Append the completed step to the trace, then evaluate the trace with the deterministic guard.

## Script / command
```bash
python scripts/progress_guard.py runtime-trace.jsonl --config config/guard.example.json --json-out progress-report.json
```

## Expected result
Exit `0`: continue; no guard threshold is breached.  
Exit `2`: block further autonomous iteration and surface the machine-readable stop reason.  
Exit `1`: invalid input/configuration; block completion because the guard could not be evaluated reliably.

## Failure behavior
A guard execution error fails closed for autonomous continuation. The orchestrator may hand control to a human or a deterministic fallback, but MUST NOT silently ignore the missing check.

## Blocking
Yes for additional autonomous iterations after a detected loop or invalid guard evaluation. This hook does not declare task success; it only authorizes or blocks another step.
