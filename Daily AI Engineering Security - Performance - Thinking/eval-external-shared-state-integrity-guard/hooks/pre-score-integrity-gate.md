# Pre-Score Integrity Gate

## Trigger
Immediately before an evaluation score is accepted, published, or compared.

## Preconditions
The run has ended; telemetry is immutable; policy and run ID are known.

## Action
Execute:
`python3 scripts/verify_eval_integrity.py --events <events.jsonl> --policy <policy.json> --run-id <run_id>`

Add `--allow-collaboration` only when collaboration is explicitly part of the benchmark contract.

## Expected result
Exit code `0` and JSON status `verified`.

## Failure behavior
Exit code `2` blocks score acceptance and records the violations. Exit code `3` blocks score acceptance because integrity could not be evaluated. Maximum two fresh-environment remediation attempts; then escalate to a human benchmark owner.

## Blocking
Yes. A missing or failed gate MUST NOT be converted into a warning-only condition.
