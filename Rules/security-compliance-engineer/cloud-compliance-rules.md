# Cloud Compliance Rules

## Purpose
Ensure cloud environments meet security and compliance obligations through explicit configuration, ownership, monitoring, and evidence.

## Scope
Applies to cloud accounts, subscriptions, projects, managed services, identity, networking, storage, compute, logging, and security controls.

## MUST
- Cloud resources in scope MUST be inventoried with owners, environment classification, and applicable control requirements.
- Identity, network exposure, encryption, logging, and configuration baselines MUST be validated against deployed state.
- Shared-responsibility assumptions MUST identify which controls are operated by the provider and which remain customer responsibilities.
- Material cloud-policy violations MUST be remediated or formally risk accepted.

## MUST NOT
- Provider compliance certifications MUST NOT be treated as proof that customer configuration is compliant.
- Public exposure MUST NOT be accepted solely because a service is cloud managed.
- Unmanaged cloud accounts or projects MUST NOT be excluded from scope without explicit justification.

## SHOULD
- Use organization-level guardrails and continuous configuration monitoring.
- Centralize evidence collection across cloud environments while preserving account-level traceability.

## Exceptions
Exceptions require exact resource scope, risk, compensating controls, owner, expiry, and approval.

## Verification
Inspect cloud inventory, organization policies, IAM, network exposure, encryption, logging, posture-management findings, and sampled deployed resources.