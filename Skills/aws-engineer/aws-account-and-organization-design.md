# AWS Account and Organization Design

## Purpose
Design secure, scalable AWS account structures and governance boundaries for multiple teams, workloads, and environments.

## When to use
Use when creating or restructuring AWS Organizations, separating environments, defining ownership, or reducing blast radius. Do not use to justify extra accounts without an operational or security reason.

## Inputs
Business domains, environments, compliance obligations, team ownership, billing model, security requirements, existing AWS accounts, deployment workflows.

## Preconditions
Access to current organization structure and stakeholder requirements. Confirm whether AWS Control Tower or an existing landing-zone framework is in use.

## Context to inspect
Organization units, SCPs, delegated administrators, shared services, network topology, identity model, logging accounts, billing ownership, naming/tagging conventions.

## Core knowledge
Accounts are strong isolation boundaries for IAM, quotas, billing, and incident blast radius. OUs should express governance intent rather than mirror an org chart blindly. SCPs limit maximum permissions but do not grant permissions.

## Procedure
1. Inventory workloads, environments, and data classifications.
2. Identify isolation needs for production, security, networking, shared services, sandbox, and regulated workloads.
3. Define account ownership and lifecycle.
4. Design OU hierarchy around policy boundaries.
5. Define baseline SCPs and exception workflow.
6. Centralize audit logs, security tooling, and billing visibility.
7. Plan account vending and decommissioning automation.
8. Validate break-glass and incident-access paths.
9. Document dependencies between shared and workload accounts.

## Decision points
Prefer separate accounts when isolation, quotas, or independent ownership matter. Avoid excessive fragmentation when operational overhead exceeds risk reduction.

## Common failure patterns
Single-account production, OU trees matching reporting lines, untested SCPs, shared root credentials, missing account ownership, and unmanaged sandboxes.

## Verification
Confirm policy simulation, account provisioning, centralized logging, budget visibility, and recovery access in representative accounts.

## Expected output
An account/OU model, governance controls, ownership model, and migration plan.

## Stop conditions
Escalate when legal or regulatory isolation requirements are unresolved, root access is unavailable, or proposed SCPs could block emergency operations.