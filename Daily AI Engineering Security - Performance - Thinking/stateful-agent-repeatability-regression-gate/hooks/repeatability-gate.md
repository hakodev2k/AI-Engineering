# Hook: Repeatability Release Gate

## Trigger
After candidate repeated-run evaluation and before release of a consequential agent workflow.

## Preconditions
Complete JSONL trial corpus; stable config; minimum trials satisfied; state assertions already executed and encoded as pass/fail/collateral fields.

## Action
Run `python scripts/repeatability_gate.py <gate-config.json> <runs.jsonl>`.

## Expected result
Exit 0 with `PASS` and computed metrics.

## Failure behavior
Exit 2 blocks release because measured reliability violates policy. Exit 1 blocks release because evidence/config is invalid or incomplete.

## Blocks completion
Yes. Thresholds may not be automatically relaxed. Store the raw corpus and gate output as verification evidence.