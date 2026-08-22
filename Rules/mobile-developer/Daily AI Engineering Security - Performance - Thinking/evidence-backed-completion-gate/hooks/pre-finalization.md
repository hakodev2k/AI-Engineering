# Hook: Pre-Finalization Completion Gate

## Trigger
Immediately before the agent emits a terminal response containing completion, success, fixed, verified, passed, deployed, or equivalent closure semantics.

## Preconditions
The current requirement/evidence ledger has been persisted and latest relevant change sequence numbers are available.

## Action
Run:

`python scripts/completion_gate.py ledger.json`

## Expected result
- Exit `0`: completion may be reported using the ledger as the source of truth.
- Exit `4`: terminal success is blocked; continue/re-plan or report incomplete/blocked state.
- Exit `2`: ledger is invalid; block completion until repaired.

## Failure behavior
A missing/malformed ledger or gate execution failure does not count as a pass. Preserve the error and block unsupported success.

## Blocks completion
Yes.

## Deterministic checks
- Every required requirement has an allowed completion state.
- `verified` has at least one fresh successful evidence record.
- Missing evidence references are rejected.
- Evidence linked to paths modified later is treated as stale.
- Explicit accepted exceptions are distinguishable from verification.

## Safety
The hook reports observable evidence only and never requests hidden chain-of-thought. It does not bypass human approval for consequential actions.
