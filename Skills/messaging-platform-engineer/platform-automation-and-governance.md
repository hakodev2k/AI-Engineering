# Platform Automation and Governance

## Purpose
Automate safe provisioning and governance of messaging resources so teams can self-serve without bypassing reliability, security, or lifecycle controls.

## When to use
Use when standardizing topic/queue creation, ACLs, schemas, quotas, retention, ownership metadata, or policy enforcement through infrastructure as code and platform APIs.

## Inputs
- Supported broker platforms
- Resource standards
- Security policy
- Tenant and ownership model
- CI/CD or IaC tooling

## Context to inspect
Inspect manual provisioning steps, drift, naming inconsistencies, privileged access, configuration history, deletion practices, and existing templates/modules.

## Core knowledge
Senior platform automation should make the safe path the easiest path. It should enforce invariants while leaving workload-specific decisions configurable. Understand idempotent provisioning, policy as code, drift detection, immutable audit trails, lifecycle states, and separation of duties.

## Procedure
1. Inventory repetitive administrative actions and risky manual changes.
2. Define required metadata such as owner, purpose, data classification, SLO tier, and retention.
3. Encode reusable modules or APIs for destination, ACL, schema, quota, and monitoring creation.
4. Validate requests before applying changes.
5. Apply least-privilege credentials to automation itself.
6. Record plans and diffs for review on high-risk changes.
7. Add drift detection for resources modified outside automation.
8. Define deprecation and deletion workflows with retention safeguards.
9. Add policy checks to CI/CD and self-service portals.
10. Test rollback and partial-failure behavior.

## Decision points
Allow automatic low-risk changes when policy validation is strong. Require review for destructive operations, broad ACLs, high quota increases, or changes affecting shared cluster capacity.

## Common failure patterns
- Automation with unrestricted admin credentials
- Templates that hard-code one workload's assumptions
- Resource creation without ownership metadata
- No drift detection
- Automated deletion without consumer or retention checks

## Verification
Provision and update representative resources through automation, verify policy rejection paths, compare actual state with declared state, and test rollback after an injected failure.

## Expected output
A governed self-service workflow with reusable automation, policy controls, auditability, drift detection, and lifecycle management.

## Stop conditions
Stop when automation would require uncontrolled administrative privileges, destructive operations lack approval controls, or resource ownership cannot be established.