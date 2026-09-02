# Governance and Compliance Rules

## Purpose
Translate organizational, regulatory, and risk requirements into enforceable cloud architecture controls with traceable evidence.

## Scope
Applies to policy baselines, resource location, data residency, tagging, auditability, control inheritance, exceptions, and compliance evidence.

## MUST
- Applicable regulatory, contractual, and organizational requirements MUST be identified before architecture decisions that constrain location, data handling, retention, encryption, or access.
- Cloud controls MUST map each material requirement to an owner, implementation mechanism, and verification method.
- Mandatory guardrails SHOULD be automated; when they cannot be automated, an auditable manual control MUST be defined.
- Policy exceptions MUST identify scope, rationale, residual risk, compensating controls, approver, and expiry or review date.
- Resource inventories MUST retain ownership and classification metadata sufficient for governance and incident response.

## MUST NOT
- MUST NOT assert compliance merely because a cloud provider holds a certification.
- MUST NOT treat provider controls as automatically satisfying customer-side responsibilities.
- MUST NOT create permanent exceptions without periodic review.

## SHOULD
- Prefer preventive policy controls for high-impact requirements and detective controls for conditions that cannot be prevented safely.
- Reuse centralized evidence collection where it does not obscure workload-specific responsibility.

## Exceptions
Exceptions require risk-owner approval and evidence that compensating controls address the stated exposure.

## Verification
Review requirement mappings, policy assignments, resource inventories, compliance scans, audit logs, exception registers, and evidence of periodic control testing.