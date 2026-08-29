# AI System Inventory Rules

## Purpose
Maintain a complete, current, auditable inventory of AI systems so governance obligations can be applied consistently across the lifecycle.

## Scope
Applies to internally developed models, embedded AI features, externally hosted models, agents, decision-support systems, automated decision systems, and material third-party AI capabilities.

## MUST
- Every production or production-intended AI system MUST be registered before release or material use.
- Inventory records MUST identify system purpose, owner, deployment context, model or provider, data categories, affected users, integrations, risk tier, lifecycle state, and approval status.
- Material model, provider, use-case, data, or deployment changes MUST update the inventory record.
- The inventory MUST distinguish experimental, internal, customer-facing, regulated, deprecated, and decommissioned systems.
- Inventory entries MUST link to authoritative risk assessments, evaluation evidence, approvals, incidents, and exceptions where applicable.
- Ownership gaps or stale records MUST trigger remediation rather than silent acceptance.

## MUST NOT
- MUST NOT omit AI embedded in vendor products merely because the organization does not train the model.
- MUST NOT represent a family of materially different deployments as one record when risk, data, or control requirements differ.
- MUST NOT mark a system decommissioned while production dependencies or retained operational access remain active.

## SHOULD
- Discovery SHOULD combine owner attestations with technical discovery where practical, including model gateway, API, cloud, package, and procurement signals.
- Inventory metadata SHOULD be machine-readable enough to support automated control checks and reporting.
- Reviews SHOULD be more frequent for high-risk or fast-changing systems.

## Exceptions
Temporary inventory gaps MUST document the reason, owner, deadline, compensating control, and approval if the gap affects risk oversight. Exceptions MUST NOT be used to bypass registration for urgent launches.

## Verification
Compare the inventory against deployment platforms, model gateways, procurement records, architecture catalogs, code repositories, cloud usage, and operational monitoring. Sample records for completeness, freshness, and valid ownership.