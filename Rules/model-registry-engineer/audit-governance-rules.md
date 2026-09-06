# Audit and Governance Rules

## Purpose
Maintain trustworthy evidence for model lifecycle decisions, ownership, approvals, and administrative actions.

## Scope
Audit trails, ownership, lifecycle transitions, policy decisions, approvals, exceptions, and administrative changes.

## MUST
- Governed lifecycle events MUST record actor, timestamp, model version, action, and outcome.
- Approval records MUST identify the exact version and decision scope.
- Registry ownership MUST be explicit for production models and governed namespaces.
- Policy exceptions MUST have reason, approver, scope, and expiry when temporary.
- Audit records MUST be protected from unauthorized alteration.

## MUST NOT
- MUST NOT infer approval from chat messages or undocumented verbal agreement.
- MUST NOT overwrite prior lifecycle history when a decision is reversed.
- MUST NOT allow anonymous privileged changes.

## SHOULD
- Use centralized audit retention aligned with organizational requirements.
- Periodically review unresolved ownership and expired exceptions.

## Exceptions
Any alternative audit mechanism requires equivalent traceability and approval.

## Verification
Inspect sampled lifecycle events, approval records, policy exceptions, ownership metadata, and audit-retention settings.