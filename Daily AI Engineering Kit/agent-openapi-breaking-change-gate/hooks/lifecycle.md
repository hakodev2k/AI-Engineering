# Lifecycle Hooks

## Pre-task contract validation
- Trigger: before API-impacting work or contract review.
- Preconditions: repository root and baseline/candidate paths known.
- Action: run `python scripts/openapi_breaking_gate.py --baseline <baseline> --candidate <candidate> --policy config/policy.yaml --output gate-result.json`.
- Expected result: valid structured result.
- Failure behavior: parse/config/input failure blocks execution.
- Blocking: yes.

## Post-edit compatibility gate
- Trigger: after API DTO/route/schema edits and after regenerating OpenAPI.
- Action: rerun the same gate command.
- Expected result: exit 0 only when no unapproved blocking finding exists.
- Failure behavior: preserve result and stop further release preparation.
- Blocking: yes.

## Final package verification
- Trigger: before declaring the kit or an integration complete.
- Action: run `python scripts/verify_package.py .` and `python -m unittest tests/test_openapi_breaking_gate.py` from the package root.
- Expected result: both commands exit 0.
- Failure behavior: completion is not verified.
- Blocking: yes.
