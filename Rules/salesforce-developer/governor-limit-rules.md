# Governor Limit Rules

## Purpose
Prevent governor-limit failures and non-scalable behavior.

## Scope
Applies to synchronous and asynchronous Apex, triggers, integrations, and batch processing.

## MUST
- Code MUST account for SOQL, DML, CPU, heap, callout, and asynchronous execution limits.
- Limit-sensitive logic MUST be tested with realistic record counts.
- Repeated expensive operations MUST be consolidated outside loops when practical.
- High-volume designs MUST document expected load and measured resource headroom.

## MUST NOT
- MUST NOT rely on low current data volume as evidence of scalability.
- MUST NOT perform avoidable SOQL or DML inside loops.
- MUST NOT move inefficient logic to asynchronous execution without addressing the underlying cost.

## SHOULD
- Critical paths SHOULD retain sufficient limit headroom for surrounding automation.
- Performance investigations SHOULD use evidence from logs and representative tests.

## Exceptions
Exceptions require measurements, alternatives considered, quantified risk, and Senior review.

## Verification
Use bulk tests, static analysis, debug logs, and representative load scenarios.