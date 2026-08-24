# Hook — Watchdog Preflight
## Trigger
Before deploying a model-stream timeout policy change.
## Preconditions
Trace file and policy file exist; proposed runtime exposes typed timeout/cancel reasons.
## Action
Run analyzer against the latest representative trace and execute unit tests.
## Script/command
`python scripts/analyze_stalls.py TRACE.jsonl --policy config/policy.json --output watchdog-report.json && python -m unittest tests/test_analyze_stalls.py`
## Expected result
Exit 0; report contains recommendations or explicitly lacks them due to sample insufficiency; tests pass.
## Failure behavior
Block deployment. Do not bypass by increasing ceilings or disabling timeouts.
## Blocks completion
Yes.
