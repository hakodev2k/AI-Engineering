# Lifecycle Hooks

## Pre-task repository validation
- **Trigger:** before exploration.
- **Preconditions:** repository root is known.
- **Action:** confirm repository is readable; record current branch/commit; locate policy file and test/build metadata.
- **Command/script:** repository-native read-only commands plus `python scripts/verify_package.py` for the kit itself.
- **Expected result:** valid repository context and no missing kit files.
- **Failure behavior:** block on missing repository or invalid kit; do not modify state.
- **Blocking:** yes.

## Post-edit delivery gate
- **Trigger:** after code/config edits affecting producer, dispatcher, consumer, persistence, or message contracts.
- **Preconditions:** a snapshot matching `examples/delivery-snapshot.json` can be produced from repository evidence/tests.
- **Action:** validate the snapshot against policy.
- **Command/script:** `python scripts/outbox_inbox_gate.py --input <snapshot.json> --policy config/policy.yaml --output <result.json>`.
- **Expected result:** exit code 0 and status `pass`.
- **Failure behavior:** preserve result JSON and block completion.
- **Blocking:** yes.

## Focused test hook
- **Trigger:** after implementation and after each corrective edit.
- **Preconditions:** project test command is known.
- **Action:** run failure-mode tests for rollback, duplicate delivery, concurrent duplicate, publish retry, and crash windows.
- **Expected result:** all relevant tests pass.
- **Failure behavior:** transient environment failures may retry twice; deterministic failures block until changed.
- **Blocking:** yes.

## Final verification hook
- **Trigger:** before reporting verified completion.
- **Preconditions:** implementation, deterministic gate, and tests finished.
- **Action:** independent verifier inspects diff scope, approvals, evidence, and unresolved risks.
- **Expected result:** `verified` with no blocking risk.
- **Failure behavior:** report executed-but-not-verified and stop.
- **Blocking:** yes.
