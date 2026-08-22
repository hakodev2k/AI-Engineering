# Database Security and Access Control

## Purpose
Reduce database attack surface and unauthorized data access through strong identity, least privilege, segmentation, encryption, and auditable controls.

## When to use
Use for access reviews, new applications, privileged-account design, compliance changes, and security incidents.

## Inputs
Users and service identities, required operations, schemas, sensitive data classes, network topology, authentication options, and audit requirements.

## Context to inspect
Inspect roles, grants, ownership, shared accounts, administrative paths, network exposure, encryption settings, audit logs, secrets, and dormant permissions.

## Core knowledge
Database permissions should express job or service responsibilities, not convenience. Administrative access, application access, and human analytical access need distinct boundaries and monitoring.

## Procedure
1. Inventory identities and effective privileges.
2. Map required operations to roles.
3. Remove broad or inherited permissions not justified by duties.
4. Separate schema ownership and runtime privileges.
5. Use managed or short-lived identity mechanisms where available.
6. Restrict network reachability to required paths.
7. Protect data in transit and at rest.
8. Audit privileged and sensitive operations.
9. Establish emergency-access procedures with review.
10. Schedule periodic access recertification.

## Decision points
Prefer role-based grants over per-user grants. Use row/column-level controls when database enforcement materially strengthens authorization, but avoid duplicating inconsistent policy layers.

## Common failure patterns
Shared admin credentials, application owner accounts, public database exposure, permanent elevated grants, and logging secrets or sensitive query parameters.

## Verification
Review effective permissions from each identity class, test denied operations, inspect audit events, and validate network restrictions.

## Expected output
A least-privilege access model with auditable privileged paths and documented exceptions.

## Stop conditions
Escalate unidentified owners, uncontrolled privileged accounts, or access changes that could interrupt critical services without coordinated testing.