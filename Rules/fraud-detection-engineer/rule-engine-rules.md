# Rule Engine Rules

## Purpose
Keep deterministic fraud rules safe, explainable, testable, and operationally controlled.

## Scope
Production decision rules, thresholds, lists, and rule orchestration.

## MUST
- Every rule MUST have a unique purpose, owner, precedence, effective scope, and measurable outcome.
- Rule changes MUST be tested against representative historical and edge-case traffic before broad rollout.
- Conflicting rules MUST have deterministic resolution semantics.
- Emergency rules MUST have expiry or mandatory review dates.

## MUST NOT
- MUST NOT add rules that duplicate existing controls without documented incremental value.
- MUST NOT deploy broad deny rules without quantified legitimate-user impact.

## SHOULD
- Rules SHOULD be independently observable and removable.
- Thresholds SHOULD be derived from evidence and periodically recalibrated.

## Exceptions
Emergency exceptions require incident context, bounded scope, owner, expiry, and retrospective validation.

## Verification
Review rule metadata, tests, simulation results, change history, hit rates, false positives, and expiry enforcement.