# Hook: Finalization Parity Check

## Trigger
Post-test and pre-release for runner/session/guardrail changes.

## Preconditions
A JSON fixture file exists with expected/actual persisted terminal state.

## Action
Run `python scripts/finalization_guard.py <fixtures.json>` from the package root.

## Expected result
Exit code 0 and a report with zero violations.

## Failure behavior
Exit code 3 blocks completion/release. Exit code 2 indicates invalid evidence/configuration and also blocks completion.

## Blocking
Yes. Do not downgrade this hook for latency or convenience.
