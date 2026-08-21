# Hook: Post-Compaction Gate

## Trigger
Immediately after a candidate context is generated and before it becomes active.

## Preconditions
`baseline.json`, `candidate.txt`, `contract.json`, and `config/policy.json` exist. Original context remains recoverable.

## Action
Run the deterministic drift gate against measured before/after token counts and preservation-contract checks.

## Script / command
```bash
python scripts/context_drift_gate.py \
  --baseline baseline.json \
  --candidate-result candidate-result.json \
  --policy config/policy.json
```

`candidate-result.json` must contain `after_tokens`, `retained_contract_ids`, `retained_critical_identifiers`, and `probe_results`.

## Expected result
Exit code `0` with decision `allow`, complete critical retention, all required probes passing, and minimum useful token reduction achieved.

## Failure behavior
Exit `3` requests a bounded retry. Exit `4` blocks activation. Invalid input exits `2`. On any blocking result, retain or restore original context.

## Blocks completion
Yes. A candidate context MUST NOT replace the original context when this hook fails.