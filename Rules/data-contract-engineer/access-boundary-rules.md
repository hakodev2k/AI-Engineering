# Access Boundary Rules

## Purpose
Align contract publication with least-privilege access and approved data-use boundaries.

## Scope
Applies to shared datasets, streams, tables, files, schemas, and governed interfaces.

## MUST
- Contracts exposing restricted data MUST identify the access boundary and intended consumer classes.
- Access changes MUST be reviewed when contract scope or sensitivity expands.
- Downstream redistribution constraints MUST be documented when they materially affect consumers.
- Production access to high-sensitivity contracts MUST be auditable.

## MUST NOT
- A contract MUST NOT imply unrestricted reuse when policy limits downstream processing.
- Access MUST NOT be broadened merely to simplify integration.
- Consumers MUST NOT receive fields outside their approved use when safer filtered contracts are practical.

## SHOULD
- Prefer separate contract views for materially different sensitivity or consumer needs.
- Access checks SHOULD be automated through platform policy where possible.

## Exceptions
Exceptions require purpose, scope, duration, risk assessment, and approval from the appropriate data or security authority.

## Verification
Inspect access-control configuration, contract classifications, entitlement records, audit evidence, and consumer scope.