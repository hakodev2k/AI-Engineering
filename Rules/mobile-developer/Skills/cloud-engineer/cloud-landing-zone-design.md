# Cloud Landing Zone Design

## Purpose
Design a governed cloud foundation that teams can safely reuse for production workloads.

## When to use
Use for new cloud estates, account/subscription restructuring, or platform standardization.

## Inputs
Organization model, workload portfolio, compliance needs, identity model, network requirements, regions, budgets.

## Context to inspect
Existing tenants/accounts, policies, billing hierarchy, shared services, connectivity, logging, security controls, deployment automation.

## Core knowledge
Landing zones establish hierarchy, identity, networking, policy, observability, security, and workload isolation. Favor guardrails and automation over manual conventions.

## Procedure
1. Classify workload and regulatory requirements.
2. Define account/subscription hierarchy and ownership.
3. Establish identity and privileged-access boundaries.
4. Design network topology and shared services.
5. Define policy-as-code and mandatory controls.
6. Centralize audit logs and security telemetry.
7. Define tagging, budgets, quotas, and ownership metadata.
8. Build reusable provisioning automation.
9. Validate with representative workloads.
10. Document exceptions and operating responsibilities.

## Decision points
Centralize controls that protect the estate; decentralize workload decisions that teams can safely own. Separate environments or workloads when blast radius, billing, compliance, or permissions justify it.

## Common failure patterns
One giant account, manual provisioning, shared administrator credentials, weak ownership, unrestricted regions, and logging added after deployment.

## Verification
Provision a test workload through the standard path and verify policies, identity, connectivity, logging, cost attribution, and isolation.

## Expected output
A repeatable landing-zone architecture with automated guardrails and clear ownership.

## Stop conditions
Escalate unresolved regulatory, identity, billing, or cross-organization ownership decisions.