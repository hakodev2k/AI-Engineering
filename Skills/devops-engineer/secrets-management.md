# Secrets Management

## Purpose
Protect credentials and sensitive configuration throughout build, deployment, and runtime.

## When to use
Use when applications or automation require tokens, passwords, keys, certificates, connection strings, or signing material.

## Inputs
Secret consumers, identity model, secret store, rotation needs, environments, compliance rules.

## Context to inspect
CI variables, repositories, images, manifests, logs, cloud secret stores, IAM, rotation history, audit events.

## Core knowledge
Prefer workload identity and short-lived credentials over stored secrets. Scope access narrowly, encrypt at rest/in transit, rotate, audit, and prevent secret material from reaching logs or artifacts.

## Procedure
1. Inventory secret types and consumers.
2. Remove secrets from source and images.
3. Prefer federated/workload identity where supported.
4. Store unavoidable secrets in managed vaults.
5. Apply least-privilege access.
6. Define rotation and revocation.
7. Mask sensitive CI output.
8. Scan history and artifacts for leakage.
9. Test expired/revoked credential behavior.
10. Monitor secret access anomalies.

## Decision points
Use certificates/managed identities for machine auth when practical; choose dynamic secrets when rotation risk outweighs complexity.

## Common failure patterns
Long-lived PATs, shared credentials, plaintext env files, secrets in logs, broad vault read access, rotation without consumer testing.

## Verification
Repository/image scans are clean, access is scoped, rotation succeeds, revoked credentials stop working, audit trail is available.

## Expected output
Documented secret lifecycle with secure distribution and rotation.

## Stop conditions
Stop and escalate immediately for suspected credential compromise.