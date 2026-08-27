# Bulkification Rules

## Purpose
Ensure logic behaves correctly and efficiently for collections of records.

## Scope
Applies to triggers, services, invocable methods, batch operations, and integrations that may process multiple records.

## MUST
- Entry points MUST accept and correctly process multiple records unless the contract explicitly guarantees a single record.
- Related records MUST be queried in sets using collected keys.
- DML MUST be grouped by operation and executed outside record-processing loops where practical.
- Bulk behavior MUST preserve per-record validation and error attribution.

## MUST NOT
- MUST NOT assume trigger batches contain one record.
- MUST NOT issue one query or DML operation per record when a set-based approach exists.
- MUST NOT sacrifice correctness of partial failures merely to reduce statements.

## SHOULD
- Services SHOULD expose collection-oriented APIs for operations invoked from triggers or automation.
- Tests SHOULD include mixed valid and invalid records in the same batch.

## Exceptions
A single-record design requires an explicit platform contract and documented justification.

## Verification
Run bulk tests near platform batch sizes, inspect query/DML counts, and review loops for database operations.