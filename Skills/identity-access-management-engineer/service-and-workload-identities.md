# Service and Workload Identities

## Purpose
Secure non-human identities used by applications, automation, CI/CD, containers, cloud workloads, and integrations.

## When to use
Use when creating or reviewing service accounts, managed identities, workload federation, API clients, deployment identities, or machine credentials.

## Inputs
Workloads, execution environments, target resources, supported identity mechanisms, credential stores, deployment lifecycle, and availability requirements.

## Context to inspect
Inspect service accounts, API keys, certificates, client secrets, managed identities, workload federation, CI secrets, permissions, rotation, ownership, and unused credentials.

## Core knowledge
Machine identities often outnumber humans and are frequently overprivileged. Prefer short-lived, automatically issued credentials bound to workload identity over static secrets. Every non-human identity needs ownership and lifecycle.

## Procedure
1. Inventory workload identities and credential types.
2. Map each identity to a workload owner and purpose.
3. Determine minimum target permissions.
4. Prefer platform-managed or federated short-lived identity.
5. Eliminate shared and embedded credentials.
6. Scope credentials to environment and workload.
7. Automate rotation when static credentials are unavoidable.
8. Monitor authentication and privilege use.
9. Revoke credentials when workloads are retired.
10. Test credential expiration and dependency failure.

## Decision points
Prefer managed identity/workload federation when supported. Certificates or secrets may be necessary for legacy systems but require secure storage and rotation. Avoid human accounts for automation.

## Common failure patterns
Secrets in repositories, one service account shared by many workloads, global permissions, credentials that never expire, no owner, and production credentials reused in lower environments.

## Verification
Scan for unmanaged credentials, validate effective permissions, rotate representative credentials, and prove retired workloads cannot authenticate.

## Expected output
A workload-identity inventory and design with least privilege, credential strategy, lifecycle, ownership, monitoring, and tests.

## Stop conditions
Escalate when a critical system only supports non-rotatable shared credentials or required privilege cannot be scoped safely.