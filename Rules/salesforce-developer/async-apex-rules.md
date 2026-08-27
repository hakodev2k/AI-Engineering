# Asynchronous Apex Rules

## Purpose
Use asynchronous execution safely and predictably.

## Scope
Applies to Queueable, Batch, Scheduled Apex, and future methods.

## MUST
- Async jobs MUST define retry, duplicate-execution, and failure-recovery behavior.
- Job inputs MUST contain stable identifiers or immutable data needed to reconstruct work.
- Chaining MUST be bounded and designed against platform limits.
- Long-running jobs MUST emit enough evidence to diagnose incomplete or failed work.

## MUST NOT
- MUST NOT use asynchronous execution merely to hide inefficient logic.
- MUST NOT assume a job runs immediately or exactly once.
- MUST NOT create unbounded job chains.

## SHOULD
- Queueable Apex SHOULD be preferred for new complex asynchronous work when appropriate.
- Batch scope sizes SHOULD be supported by measurement for high-volume processing.

## Exceptions
Exceptions require documented platform constraints, failure model, and recovery evidence.

## Verification
Test delayed execution, duplicates, partial failures, chained jobs, and monitoring behavior.