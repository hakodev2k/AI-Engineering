# Pre-Compaction Integrity Check Hook

## Trigger
Immediately before any automatic destructive compaction/summarization.

## Preconditions
Token snapshot and budget config available; current session is not already inside a compaction operation.

## Action
Run the deterministic accounting gate. Only `decision=allow_compaction` permits automatic compaction.

## Command
```bash
python scripts/context_accounting_gate.py "$TOKEN_SNAPSHOT" --budget config/budget.example.json --out "$COMPACTION_GATE_REPORT"
```

## Expected result
Exit code 0. Report names the accepted occupancy field/source, utilization, threshold, freshness, and decision.

## Failure behavior
Non-zero exit, `block`, or `defer` prevents destructive automatic compaction. Record the report and investigate token-state provenance.

## Post-action check
After compaction, measure before/after tokens. If reclaim ratio is below policy minimum, record a low-reclaim event; two consecutive low-reclaim events block further automatic compaction.

## Blocks completion
Yes for destructive compaction. The session may continue without compaction if it remains safely below a verified hard context limit.
