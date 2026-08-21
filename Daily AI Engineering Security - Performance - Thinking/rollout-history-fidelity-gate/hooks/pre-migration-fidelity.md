# Hook: Pre/Post Migration Fidelity Gate

## Trigger
Immediately before destructive migration/replacement and again before reporting migration/resume repair complete.

## Preconditions
Canonical source is immutable for the check; backup path is recorded; Python 3.10+ is available.

## Action
Before apply, scan source and reject parse/ordinal defects. After apply, compare source and target normalized ledgers.

## Commands
`python3 scripts/rollout_fidelity.py scan source.jsonl`

`python3 scripts/rollout_fidelity.py compare source.jsonl target.jsonl`

## Expected result
Exit 0. Compare report shows zero missing fingerprints, zero excess fingerprints, zero ordinal regressions, and no parse errors.

## Failure behavior
Exit 2 means invalid input/configuration. Exit 3 means fidelity violation. Both block destructive replacement/completion. Preserve source and backup; invoke `workflows/audit-rebuild-verify.md`.

## Blocking
Yes.