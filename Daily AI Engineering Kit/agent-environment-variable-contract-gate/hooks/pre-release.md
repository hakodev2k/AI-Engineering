# Hook: Pre Release

## Trigger

Before declaring a release/deployment package configuration-ready.

## Preconditions

Repository changes are reviewed and the target environment is known.

## Action

1. Validate the target environment's non-secret sample or injected process environment with `scripts/check_env_contract.py`.
2. Run `python scripts/verify_package.py` for this reusable kit after kit changes.
3. Confirm application-level build/tests and startup/configuration tests pass.
4. Confirm production configuration, secret, deployment, or infrastructure actions have explicit human approval before execution.

## Expected result

Contract status `pass`, repository verification passes, and approval evidence exists for any dangerous external action.

## Failure behavior

Block release readiness. Do not make missing production variables optional as a workaround.

## Blocking

Yes.