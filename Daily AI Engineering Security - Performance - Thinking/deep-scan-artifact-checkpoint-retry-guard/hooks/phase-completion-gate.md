# Hook: Phase Completion Gate

## Trigger
Before a worker/phase transitions from running to complete and immediately before any retry after terminal failure.

## Preconditions
Scan id, immutable target revision, phase, and required artifact list are known.

## Action
Run `scripts/checkpoint_guard.py checkpoint` for required outputs. Persist its JSON result. On failure, keep the phase incomplete and enter recovery analysis. Before retry, run `checkpoint_guard.py retry` with actual scope, terminal-failure flag, remaining quota policy, repeated-failure count, and explicit approval state.

## Commands
`python scripts/checkpoint_guard.py checkpoint --root <artifact-root> --scan-id <id> --revision <sha> --phase <phase> --required <path> [--required <path> ...] --out checkpoint.json`

`python scripts/checkpoint_guard.py retry --scope <worker|phase|full> --terminal-failure --quota-remaining <percent> --min-quota <percent> [--approved]`

## Expected result
Checkpoint exits 0 only when every required artifact exists and is non-empty. Retry exits 0 only when policy permits the requested scope.

## Failure behavior
Block the transition/retry, preserve existing artifacts, emit the deterministic reason, and hand off to recovery analysis.

## Blocking
Yes. Missing artifacts and disallowed expensive retries block completion.