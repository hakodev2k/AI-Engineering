# Lifecycle Hooks

## Pre-task repository scan
- Trigger: before investigation or editing.
- Preconditions: repository root exists; Python 3 available.
- Action: `python scripts/scan-outbox.py <repo-root> --output outbox-evidence.json`.
- Expected result: evidence JSON is produced even when findings block progress.
- Failure behavior: exit 2 blocks execution as environment/input failure; exit 1 means blocking findings require investigation, not blind retry.
- Blocking: yes for exit 2; findings gate implementation decisions.

## Post-edit focused validation
- Trigger: after implementation edits.
- Preconditions: host repository build/test commands identified.
- Action: run formatter/build and focused transaction/outbox/publisher/consumer tests, then rerun scanner.
- Expected result: commands pass and scanner findings are classified with evidence.
- Failure behavior: preserve command/output; retry transient infrastructure failure at most twice; reproducible failure returns to implementation.
- Blocking: yes.

## Final evidence verification
- Trigger: before declaring completion.
- Preconditions: independent verifier has updated `outbox-evidence.json` from test/review evidence.
- Action: `python scripts/verify-evidence.py outbox-evidence.json`.
- Expected result: exit 0 and status `verified` with all four verification checks true.
- Failure behavior: block completion and report invalid/missing evidence.
- Blocking: yes.
