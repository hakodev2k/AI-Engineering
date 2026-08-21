# Context Freshness Hooks

## Pre-plan hook
- **Trigger:** before planning or architecture analysis.
- **Action:** validate manifest, check staleness, evaluate gate.
- **Command:** `python scripts/validate-context-manifest.py <manifest> && python scripts/check-context-staleness.py <manifest> <repo-root> <report> && python scripts/evaluate-context-gate.py <manifest> <report> <review> <gate>`
- **Expected result:** gate status `verified`.
- **Failure:** block planning.

## Pre-edit hook
- **Trigger:** immediately before source edits.
- **Action:** rerun staleness check against current repository.
- **Expected result:** no blocking drift since planning.
- **Failure:** discard edit authorization, refresh context, review again.

## Post-repository-change hook
- **Trigger:** checkout, pull, merge, rebase, generated-code refresh, dependency lockfile update, or external edits.
- **Action:** invalidate the prior gate and rerun the workflow.
- **Failure:** block continuation.

## Final-verification hook
- **Trigger:** before task completion.
- **Action:** prove that verification used context bound to the repository revision being reported.
- **Failure:** task may be executed but must not be reported as verified successfully.