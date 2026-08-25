# Identity and Access Design

## Purpose
Design least-privilege database access for people, applications, automation, and platform services.

## When to use
Use when onboarding workloads, redesigning roles, reviewing excessive privileges, or introducing federation or managed identities.

## Inputs
Identity sources, workload inventory, job functions, required operations, database objects, compliance constraints, and current grants.

## Context to inspect
Inspect authentication mechanisms, role hierarchy, group mappings, ownership, default privileges, break-glass access, and service-account lifecycle.

## Core knowledge
Separate authentication from authorization. Prefer group or role assignment over direct grants, short-lived credentials over static secrets, and scoped privileges over broad built-in roles. Ownership often implies powers beyond explicit grants.

## Procedure
1. Inventory principals and required actions.
2. Classify interactive, workload, automation, and emergency identities.
3. Define roles around stable responsibilities.
4. Map privileges to minimum objects and operations.
5. Separate administration, deployment, read, write, and audit duties.
6. Configure federation or managed identity where supported.
7. Remove redundant direct grants.
8. Define joiner/mover/leaver and credential lifecycle.
9. Test allowed and denied paths.

## Decision points
Use row or column controls when object-level grants cannot express business boundaries. Use privileged access elevation for rare administrative tasks rather than permanent membership.

## Common failure patterns
Shared accounts, nested-role privilege creep, wildcard grants, application ownership of schemas, dormant users, and untested deny assumptions.

## Verification
Query effective privileges, test representative identities, inspect audit events, and confirm revocation works.

## Expected output
A documented role model, grant plan, lifecycle process, and verification evidence.

## Stop conditions
Escalate when business duties are unclear, privilege reduction may break production, or identity-provider changes require external approval.