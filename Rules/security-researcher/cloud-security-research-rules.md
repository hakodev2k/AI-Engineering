# Cloud Security Research Rules

## Purpose
Ensure cloud security research respects tenant boundaries, identity controls, managed-service semantics, and the potentially broad blast radius of control-plane actions.

## Scope
Applies to cloud identities, APIs, storage, compute, serverless, managed databases, metadata services, networking, policies, and control-plane configurations.

## MUST
- Research MUST identify the authorized account, subscription, project, tenant, region, and resources before active testing.
- Cloud identity tests MUST document the principal, effective permissions, trust relationship, and intended boundary.
- Control-plane changes used for testing MUST be minimal, reversible, and tracked for cleanup.
- Public exposure findings MUST distinguish configured accessibility from demonstrated unauthorized access.
- Storage tests MUST use controlled objects whenever equivalent evidence can be obtained without accessing customer data.
- Cross-account or cross-tenant findings MUST stop at minimal proof unless broader validation is explicitly approved.
- Research involving metadata, workload identity, or temporary credentials MUST prevent secret leakage into logs and reports.
- Provider-specific assumptions MUST be validated against actual configuration and runtime behavior.

## MUST NOT
- MUST NOT enumerate unrelated tenants, accounts, buckets, projects, or identities outside authorized scope.
- MUST NOT attach broad administrator permissions merely to simplify a test.
- MUST NOT disable organization-wide safeguards, logging, or policy controls without explicit approval.
- MUST NOT destroy cloud resources or alter production routing as part of routine validation.
- MUST NOT assume a default provider setting is present without configuration evidence.

## SHOULD
- Prefer isolated research accounts with representative policies.
- Use audit logs and policy simulation to corroborate identity findings.
- Track cost-generating experiments and impose resource quotas or automatic teardown where practical.

## Exceptions
Production control-plane changes, high-risk access grants, organization-level policy changes, or destructive actions require explicit human approval, documented rollback, monitoring, and owner coordination.

## Verification
Inspect identity policies, resource configuration, audit logs, test principals, change history, cleanup records, and provider telemetry. Confirm the claimed boundary is actually crossed under the documented configuration.