# Secrets and Credential Management

## Purpose
Prevent database credentials from becoming durable, widely copied attack material.

## When to use
Use when applications connect to databases, credentials are rotated, secrets appear in code or logs, or authentication is modernized.

## Inputs
Connection methods, secret stores, deployment pipelines, rotation capabilities, application behavior, and credential inventory.

## Context to inspect
Search configuration, CI/CD, environment variables, container definitions, logs, backups, runbooks, and local tooling for credential exposure.

## Core knowledge
Prefer identity federation, workload identity, or short-lived tokens. If passwords or keys remain necessary, centralize storage, restrict retrieval, rotate safely, and avoid plaintext persistence.

## Procedure
1. Inventory credentials and consumers.
2. Classify static versus dynamic authentication.
3. Replace static secrets where supported.
4. Store remaining secrets in an approved secret manager.
5. Scope retrieval permissions to exact workloads.
6. Implement dual-secret or coordinated rotation where zero downtime is required.
7. Prevent secrets from entering logs and artifacts.
8. Revoke superseded credentials.
9. Test recovery from failed rotation.

## Decision points
Choose dynamic credentials when platform support and connection pooling permit. Use overlapping credentials during rotation only for a bounded transition.

## Common failure patterns
Secrets committed to repositories, rotation without consumer coordination, broad vault read access, secrets embedded in images, and credentials retained after migration.

## Verification
Scan artifacts, inspect secret-store access, rotate a representative credential, confirm old credentials fail, and validate application continuity.

## Expected output
A credential inventory, secure storage/authentication design, and tested rotation procedure.

## Stop conditions
Escalate on suspected active credential compromise or when rotation cannot be performed without unacceptable production risk.