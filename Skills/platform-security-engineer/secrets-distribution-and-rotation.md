# Secrets Distribution and Rotation

## Purpose
Secure the lifecycle of platform and workload secrets from creation through delivery, use, rotation, revocation, and deletion.

## When to use
Use when designing secret delivery, migrating from embedded credentials, reviewing secret exposure, or standardizing rotation across platform services.

## Inputs
Secret stores, deployment systems, workload runtimes, rotation capabilities, access policies, secret consumers, incident history, and recovery procedures.

## Context to inspect
Inspect source repositories, CI logs, environment variables, mounted files, sidecars, secret managers, backup copies, audit logs, and emergency credentials.

## Core knowledge
Secret security depends on minimizing secret count and lifetime, limiting read paths, preventing accidental persistence, and ensuring rotation does not cause outages. Dynamic credentials are preferable when supported.

## Procedure
1. Inventory secrets and owners.
2. Classify by privilege, lifetime, and blast radius.
3. Remove secrets from source control and build artifacts.
4. Centralize storage in approved secret-management systems.
5. Define least-privilege read policies.
6. Prefer dynamic or short-lived credentials.
7. Design delivery that avoids plaintext logging and unnecessary disk persistence.
8. Implement automated rotation with overlap where required.
9. Define revocation and emergency rotation procedures.
10. Test rotation against real consumers.
11. Monitor failed reads, unusual access, and stale versions.
12. Delete obsolete secrets and validate they are unusable.

## Decision points
Choose push versus pull delivery based on runtime trust and operational constraints. Use per-workload secrets when shared credentials would increase blast radius materially.

## Common failure patterns
Secrets in CI variables without governance, permanent credentials, rotation without consumer testing, shared credentials across environments, and backups retaining revoked secrets indefinitely.

## Verification
Verify no secret material appears in repositories or logs, rotation succeeds without downtime, revoked credentials fail, and audit logs identify consumers.

## Expected output
A controlled secret lifecycle, rotation plan, access model, evidence of revocation, and monitored usage.

## Stop conditions
Stop when secret ownership is unknown, required revocation could cause uncontrolled production impact, or compromise evidence requires incident response.