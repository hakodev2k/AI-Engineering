# Failure and Recovery Rules

## Purpose
Ensure edge AI failures degrade predictably and recover without corrupting state or trapping devices in unusable loops.

## Scope
Model load failures, runtime crashes, corrupted artifacts, failed updates, inference errors, and fallback behavior.

## MUST
- Failure modes MUST define safe user-visible or system fallback behavior.
- Repeated startup or inference failures MUST be bounded rather than retried indefinitely.
- Corrupt or incompatible model artifacts MUST trigger recovery to a known-good state when available.
- Recovery MUST preserve data integrity and required privacy boundaries.

## MUST NOT
- MUST NOT hide persistent failures behind endless restart or redownload loops.
- MUST NOT continue using an artifact after integrity or compatibility validation fails.

## SHOULD
- Preserve enough local diagnostic evidence to distinguish artifact, runtime, resource, and input failures.

## Exceptions
Require documented impact, compensating controls, and approval.

## Verification
Inspect retry limits, rollback tests, corruption tests, recovery logs, and known-good restoration behavior.