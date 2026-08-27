# DML and Transaction Rules

## Purpose
Protect data integrity across Salesforce transactions and side effects.

## Scope
Applies to DML, savepoints, rollbacks, transaction boundaries, and mixed business operations.

## MUST
- Multi-record business operations MUST define atomicity and partial-failure behavior explicitly.
- DML results MUST be inspected when partial success APIs are used.
- Cross-object updates MUST preserve invariants even when downstream logic fails.
- Irreversible or high-impact data changes MUST require explicit approval and a recovery plan.

## MUST NOT
- MUST NOT ignore failed SaveResult entries.
- MUST NOT assume external callouts participate in Salesforce database rollback.
- MUST NOT perform destructive production data changes without human approval.

## SHOULD
- Savepoints SHOULD be used only when rollback semantics materially improve correctness.
- Transaction boundaries SHOULD remain small enough to reduce lock and limit pressure.

## Exceptions
Exceptions require documented consistency model, failure handling, recovery, and approval.

## Verification
Use failure-path tests, partial-success tests, lock-contention scenarios, and review transaction sequencing.