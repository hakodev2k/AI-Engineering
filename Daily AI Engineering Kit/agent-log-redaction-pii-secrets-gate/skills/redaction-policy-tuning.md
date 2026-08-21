# Redaction Policy Tuning Skill

## Purpose
Tune detection coverage without weakening the safety boundary or leaking examples of real secrets.

## Inputs
False-positive/false-negative reports, synthetic test samples, destination risk level, current `config/redaction.yaml`.

## Preconditions
Use synthetic or irreversibly masked samples. Never place real credentials or customer data into tests.

## Process
1. Classify the reported miss/noise by detector type.
2. Reproduce it with synthetic data preserving only structural characteristics.
3. Prefer narrowing/adding a deterministic pattern over broad allowlisting.
4. If an allowlist is unavoidable, make it exact and document why the value class is safe.
5. Add or update tests before changing production policy.
6. Run unit tests and package verification.
7. Re-scan representative synthetic fixtures.
8. Require security-owner approval before removing a blocked type or materially widening an allowlist.

## Constraints
- Never copy a production secret into configuration or a test fixture.
- Never disable `fail_closed` merely to make a workflow continue.
- Never remove private-key/token detection without explicit approval.
- Custom regexes must have a bounded, reviewable purpose and avoid catastrophic-backtracking constructs.

## Expected output
Policy diff, synthetic regression test, risk statement, verification results, approval reference when required.

## Verification
The reported synthetic case is handled correctly, previous tests still pass, and blocked categories remain protected.

## Failure handling
If a reliable regex cannot distinguish safe from sensitive data, keep the conservative detector and route disputed artifacts to human review.

## Stop conditions
Real secret required for reproduction, policy weakening without approval, or tests cannot establish expected behavior.
