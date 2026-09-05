# Hook: Pre-Completion Gate

## Trigger
Immediately before an agent emits or writes a completion/readiness claim.

## Preconditions
Contract and evidence ledger are serialized JSON; requested readiness is known.

## Action
Run deterministic readiness/circuit-breaker validation.

## Command
`python scripts/readiness_guard.py <contract.json> <evidence.json> <claimed-readiness>`

## Expected result
Exit 0 with `PASS`.

## Failure behavior
Exit 4 blocks unsupported/stale readiness. Exit 5 blocks and requires replan/stop due to circuit breaker. Exit 1 blocks because validation itself is invalid.

## Blocks completion
Yes.