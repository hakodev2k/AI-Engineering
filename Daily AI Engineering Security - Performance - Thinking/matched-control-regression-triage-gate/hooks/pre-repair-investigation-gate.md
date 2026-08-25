# Hook: Pre-Repair Investigation Gate

## Trigger
Before an agent edits code/configuration in response to a regression diagnosis.

## Preconditions
Investigation ledger exists.

## Action
Run `python scripts/triage_ledger.py check --ledger <investigation.json> --stage repair`.

## Expected result
Exit 0 with `status: pass`.

## Failure behavior
Block repair, return missing/violated invariants, and allow correction only when new evidence or ledger state changes.

## Blocking
Yes. The hook blocks repair when matched-control search, differences, hypotheses, or retry limits are incomplete.