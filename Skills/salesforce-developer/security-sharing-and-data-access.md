# Security, Sharing, and Data Access

## Purpose
Design and verify Salesforce authorization so Apex, LWC, integrations, and automation expose only data and actions users are entitled to access.

## When to use
Use for any feature that reads or mutates business data, especially privileged services, integrations, guest/community access, and cross-user operations.

## Inputs
Personas, permission sets, object/field access, OWD, roles, sharing rules, Apex classes, UI requirements, integration identities.

## Preconditions
Required user capabilities and data-ownership rules are known.

## Context to inspect
OWD, role hierarchy, criteria/owner sharing, teams, manual/Apex sharing, permission sets, CRUD/FLS, class sharing declarations, user-mode/system-mode operations.

## Core knowledge
Record sharing, object permissions, field permissions, and execution mode are distinct layers. `with sharing` enforces record access but not automatically every CRUD/FLS concern. Privilege elevation must be explicit, minimal, and auditable.

## Procedure
1. Define personas and least-privilege actions.
2. Map object, field, and record access separately.
3. Inspect inherited sharing and entry-point context.
4. Prefer user-mode operations where business behavior should mirror user access.
5. Enforce CRUD/FLS for exposed fields and mutations.
6. Isolate any system-mode code behind narrow service boundaries.
7. Validate dynamic SOQL and field lists against allowlists/access.
8. Test representative users with different roles and permission sets.
9. Check guest/external-user paths separately.
10. Document intentional privilege elevation and audit evidence.

## Decision points
Use sharing rules for durable declarative access; Apex-managed sharing only when access is data-driven and cannot be expressed declaratively. Use system mode only when the business process explicitly requires service authority.

## Common failure patterns
Assuming `with sharing` handles FLS, insecure dynamic field exposure, administrator-only testing, broad integration permissions, and implicit system-mode behavior.

## Verification
Run positive and negative authorization tests, verify inaccessible records/fields remain inaccessible, and inspect permission changes required for deployment.

## Expected output
A least-privilege access design with code enforcement and persona-based verification evidence.

## Stop conditions
Escalate when required access conflicts with policy, privilege elevation lacks approval, or external-user sharing implications are unclear.