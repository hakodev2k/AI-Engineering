# Secretless Migration Review Skill

## Purpose
Review a proposed migration from a stored bootstrap credential to workload identity/federation without confusing successful authentication with correct authorization.

## Inputs
Diff, deployment identity configuration, target resource, expected permissions, test evidence, rollback plan, and scanner result.

## Process
1. Confirm the old and new credential paths from repository evidence.
2. Verify the new identity is uniquely attributable to the intended workload/environment.
3. Verify requested audience/resource and least-privilege permissions independently from credential acquisition.
4. Confirm credential caching/renewal is handled by the supported provider rather than custom long-lived persistence.
5. Confirm logs and diagnostics do not emit tokens or provider responses containing credentials.
6. Run package tests and the scanner against changed files/repository.
7. Require a positive integration test and a negative test using an identity without the required permission.
8. Inspect the diff for fallback logic that silently re-enables a static secret in production.
9. Confirm rollback restores service safely without requiring a secret to be committed or pasted into agent context.
10. Mark `verified` only when all evidence exists; otherwise return `blocked` with exact missing evidence.

## Failure handling
Do not fix authorization failures by increasing privilege during review. One implementation correction may be returned to the implementer; a repeated failure stops the loop and escalates.

## Completion criteria
No unexplained static bootstrap credential remains in the production path, intended identity succeeds, unauthorized identity fails, renewal is supported, required approval exists, and independent evidence supports the result.
