# Error Handling Rules

## Purpose
Make failures explicit, diagnosable, bounded, and safe.

## Scope
Driver errors, invalid state, assertions, return codes, exceptions where supported, and recovery paths.

## MUST
- Check and propagate actionable failures across abstraction boundaries.
- Define safe behavior for unrecoverable states.
- Preserve enough context to distinguish root failures from downstream symptoms.

## MUST NOT
- Silently ignore unexpected hardware, protocol, storage, or initialization errors.
- Continue operating with invalid invariants when doing so can corrupt state or create unsafe behavior.

## SHOULD
- Classify errors by recoverability and ownership so escalation is deterministic.

## Exceptions
Deliberately ignored errors require documented rationale and proof that consequences are harmless.

## Verification
Review every failure-returning API path; inject representative faults and confirm safe state, diagnostics, and recovery.