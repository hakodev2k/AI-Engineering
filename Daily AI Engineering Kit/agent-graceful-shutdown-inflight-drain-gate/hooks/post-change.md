# Hook: Post Change

## Trigger
After shutdown-affecting edits.

## Action
1. Capture candidate shutdown snapshot.
2. Run `scripts/shutdown_drain_gate.py`.
3. Run lifecycle tests with active in-flight work.
4. Run host build/static/unit/integration checks.
5. Run `python scripts/verify_package.py`.
6. Inspect the diff for unrelated lifecycle/configuration changes.
7. Preserve gate and test evidence.
8. Hand evidence to Verification Agent.

## Expected result
Deterministic shutdown status plus runtime lifecycle evidence.

## Failure behavior
Any blocking gate finding, failed lifecycle test, unknown side-effect state, or unresolved approval blocks completion.

## Blocking
Yes.
