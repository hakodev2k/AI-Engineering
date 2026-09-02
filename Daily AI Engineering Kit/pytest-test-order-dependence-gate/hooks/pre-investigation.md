# Hook: Pre Investigation

## Trigger

Before running permutation or victim-sequence investigation.

## Preconditions

Repository root and gate configuration are known.

## Action

1. Confirm `python --version` succeeds.
2. Confirm `python -m pytest --version` succeeds in the target environment.
3. Confirm the repository root is not a production deployment directory or mounted production data path according to local project policy.
4. Run pytest collection for the intended scope before permutation execution.
5. Refuse execution when collected tests exceed `config/gate-config.json` `max_tests` unless configuration is explicitly reviewed.

## Expected result

A valid bounded test set and trustworthy execution environment.

## Failure behavior

Collection, environment, or scope validation failure blocks the investigation. Maximum one retry after deterministic correction.

## Blocking

Yes.