# Hook: Pre-finalize Gate

## Trigger
Immediately before any terminal success/completion response.

## Preconditions
Current goal ledger is persisted and correction events have been reconciled.

## Action
Run `python3 scripts/ledger_gate.py goal-ledger.json`, then require Acceptance Verifier PASS for rows marked independent-verification-required.

## Expected result
Exit 0, `can_finalize=true`, no required criterion without current evidence, and the requested deliverable exists.

## Failure behavior
Exit 2 blocks completion due to malformed ledger. Exit 3 blocks completion due to unresolved criteria. Resume bounded workflow or report a real blocker; never rewrite criteria merely to pass.

## Blocking
Yes. This hook is a deterministic terminal-response gate.