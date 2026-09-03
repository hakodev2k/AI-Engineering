# Contract Ownership Rules

## Purpose
Establish explicit accountability for every governed data contract.

## Scope
Applies to schemas, events, tables, streams, files, semantic models, and APIs treated as shared data products.

## MUST
- Every contract MUST identify an owning team or role responsible for semantics, compatibility, and lifecycle decisions.
- Ownership MUST include an escalation path for breaking changes, incidents, and unresolved consumer impact.
- Ownership changes MUST be recorded before responsibility is transferred.
- Shared fields MUST have a single authoritative definition or a documented reconciliation rule.

## MUST NOT
- Contracts MUST NOT exist as ownerless shared assets.
- Producers MUST NOT delegate contract responsibility implicitly to consumers.
- Ownership MUST NOT be inferred only from repository history or infrastructure deployment identity.

## SHOULD
- Ownership SHOULD align with the domain that defines the business meaning of the data.
- Secondary operational contacts SHOULD be documented for critical contracts.

## Exceptions
Temporary ownership exceptions require a named accountable party, expiration date, risk statement, and approval from affected stakeholders.

## Verification
Inspect contract metadata, repository ownership rules, service catalog entries, and escalation documentation. Confirm each active contract has a current accountable owner.