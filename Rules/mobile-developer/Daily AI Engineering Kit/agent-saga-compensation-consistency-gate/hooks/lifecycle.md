# Lifecycle Hooks

## Pre-task: saga plan validation
- **Trigger:** before implementation.
- **Preconditions:** a JSON saga plan exists.
- **Action:** run `python scripts/saga_gate.py --input <plan.json> --policy config/policy.yaml`.
- **Expected result:** exit 0 and status `pass` or `needs-approval` with an explicit approval boundary.
- **Failure behavior:** block implementation planning if required structural data is missing.
- **Blocking:** yes.

## Post-edit: targeted test execution
- **Trigger:** after saga-related code changes.
- **Action:** run repository tests covering forward and compensation paths plus `python -m unittest tests/test_saga_gate.py` for package self-tests.
- **Expected result:** all selected tests pass.
- **Failure behavior:** preserve output; allow at most two environment/tool retries; code failures return to implementation.
- **Blocking:** yes.

## Final verification
- **Trigger:** before declaring completion.
- **Action:** run `python scripts/verify_package.py` and rerun the saga gate against the final plan.
- **Expected result:** package references exist and final verification evidence is present.
- **Failure behavior:** block completion.
- **Blocking:** yes.
