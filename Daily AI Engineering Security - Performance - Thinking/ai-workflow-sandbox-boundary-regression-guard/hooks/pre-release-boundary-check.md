# Hook: Pre-Release Sandbox Boundary Check

## Trigger
Before releasing or deploying a build that includes custom-code/evaluator runtime changes, dependency changes, or sandbox-related configuration changes.

## Preconditions
A current inventory JSON and `config/sandbox-policy.json` exist. Production secrets are excluded.

## Action
Run:
`python scripts/sandbox_boundary_guard.py --inventory <inventory.json> --policy config/sandbox-policy.json`

Then run:
`python -m unittest tests/test_sandbox_boundary_guard.py`

## Expected result
Both commands return exit code `0`.

## Failure behavior
Any non-zero exit blocks the release/deployment. Preserve the violation list and route it to the platform/security owner. Do not downgrade policy or bypass tests to continue.

## Blocking
Yes.
