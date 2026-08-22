# Lifecycle Hooks

## Pre-task repository validation
Trigger: before investigation. Action: confirm queue provider/config, locate receive/renew/settle paths, and run `python scripts/verify_package.py`. Expected: package structure valid. Failure blocks execution.

## Post-edit lease simulation
Trigger: after lease-related edits. Preconditions: Python 3.10+. Action: `python scripts/lease_guard.py --message-id post-edit --handler-ticks 2 --output lease-result.json`. Expected: status `pass`. Failure blocks verification.

## Failure-injection verification
Trigger: before completion. Action: run targeted repository tests for lease loss and renewal rejection; if adapting this kit directly, invoke the unit tests in `tests/test_lease_guard.py`. Expected: unsafe settlement is impossible. Failure blocks completion.

## Final verification
Trigger: final workflow stage. Action: run build/tests, inspect diff, verify no approval-required production mutation was executed, then run `python scripts/verify_package.py`. Any failure blocks success.
