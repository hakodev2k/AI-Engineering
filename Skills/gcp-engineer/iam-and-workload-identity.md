# IAM and Workload Identity

## Purpose
Design least-privilege human and workload access across Google Cloud using groups, service accounts, IAM Conditions, and workload federation.

## When to use
Use when onboarding applications, integrating CI/CD, removing long-lived keys, or reviewing excessive permissions.

## Inputs
Actors, resources, required actions, identity provider, runtime environment, and audit requirements.

## Context to inspect
Project/folder IAM policies, service account usage, key inventory, group memberships, conditional bindings, workload identity pools, and audit logs.

## Core knowledge
IAM roles are collections of permissions; policy inheritance can widen access unexpectedly. Service account impersonation is preferable to static credentials. Workload Identity Federation avoids distributing service account keys to external systems.

## Procedure
1. Map actors to exact required operations.
2. Prefer predefined roles before custom roles.
3. Bind groups rather than individual users.
4. Separate runtime, deployment, and administrative identities.
5. Replace service account keys with impersonation or federation.
6. Use conditions for bounded access where appropriate.
7. Test denied and allowed paths.
8. Review privilege escalation routes.
9. Enable audit visibility and periodic review.

## Decision points
Use custom roles only when predefined roles are materially overbroad. Use service account impersonation for trusted Google identities; federation for external identities.

## Common failure patterns
Owner/editor grants, shared service accounts, static JSON keys, circular impersonation, and ignoring inherited access.

## Verification
Use Policy Troubleshooter, IAM policy inspection, denied-access tests, and audit logs to prove intended boundaries.

## Expected output
A least-privilege access model with no unnecessary long-lived credentials.

## Stop conditions
Stop if required permissions cannot be justified or identity ownership is unknown.