# Skill: Update Environment Contract

## Purpose

Safely change the environment-variable contract alongside code/configuration changes.

## Inputs

Requested change, current contract, configuration usage evidence, target environments, tests, and deployment definitions.

## Process

1. Identify the exact variable additions, removals, renames, or constraint changes.
2. Trace every affected code/configuration reference.
3. Determine required environments from actual runtime behavior.
4. Classify secrets conservatively.
5. Update `config/env-contract.json`.
6. Update sample files with safe placeholders/defaults.
7. Add or update unit tests for the changed rule.
8. Run the validator for each affected environment.
9. Run repository build/tests relevant to the configuration consumer.
10. Inspect the diff for leaked values and unintended configuration widening.
11. Record remaining operational changes separately from repository completion.

## Constraints

Do not lower production requirements, widen allowed values, or convert secret fields to non-secret solely to unblock validation.

## Expected output

Contract + sample + test changes with deterministic validation evidence.

## Verification

`python scripts/verify_package.py` passes and the parent repository's applicable tests/build pass.

## Failure handling

At most 2 repair cycles for validation/test failures. Preserve failing output; after 2 cycles escalate with evidence rather than repeatedly weakening the contract.

## Stop conditions

Stop on secret exposure, ambiguous production behavior, missing approval for production-impacting changes, or repeated deterministic failure.