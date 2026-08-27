# SOQL Query Rules

## Purpose
Keep Salesforce data access selective, predictable, and scalable.

## Scope
Applies to SOQL and SOSL used by Apex, integrations, and data services.

## MUST
- Queries MUST retrieve only fields required by the caller.
- Filter strategy MUST consider selectivity and expected data growth for high-volume objects.
- Query construction MUST preserve sharing and security requirements appropriate to the execution context.
- Dynamic queries MUST use binding or equivalent safe parameterization for untrusted values.

## MUST NOT
- MUST NOT query unbounded datasets for interactive requests.
- MUST NOT concatenate untrusted input into dynamic SOQL.
- MUST NOT claim a query is optimized without execution evidence for material changes.

## SHOULD
- Query plans SHOULD be inspected for high-volume or latency-sensitive paths.
- Pagination or asynchronous processing SHOULD be used for large result sets.

## Exceptions
Exceptions require documented volume assumptions, evidence, and reviewer approval.

## Verification
Review query plans, logs, data volumes, selected fields, security mode, and tests with representative datasets.