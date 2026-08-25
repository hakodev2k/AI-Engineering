# Secrets Management

## Purpose
Prevent credentials and cryptographic secrets from being exposed, overprivileged, or impossible to rotate safely.

## When to use
Use for application credentials, API keys, signing keys, database passwords, CI/CD secrets, and secret-exposure incidents.

## Inputs
Secret inventory, deployment configuration, identity model, vault configuration, logs, CI pipelines, and rotation capabilities.

## Context to inspect
Inspect source history, build logs, environment variables, container definitions, crash reports, telemetry, local development, and backup paths.

## Core knowledge
Secrets require controlled generation, storage, distribution, use, rotation, revocation, and audit. Workload identity is preferable to static credentials when supported.

## Procedure
1. Inventory secrets and owners; classify blast radius.
2. Identify where each secret is created, stored, delivered, read, and logged.
3. Replace embedded credentials with managed secret stores or workload identity.
4. Minimize permissions and scope.
5. Define rotation and revocation procedures before relying on a credential.
6. Prevent secret values from entering logs, errors, artifacts, and source control.
7. Add secret scanning to developer and CI workflows with triage rules.
8. Test rotation without downtime where required.
9. For exposure, revoke first when feasible, then investigate historical access.

## Decision points
Prefer short-lived federated identity over long-lived keys. Environment variables may be acceptable for delivery but are not themselves a secret-management system.

## Common failure patterns
Committing secrets then only deleting the file, shared credentials, rotation that breaks deployments, broad vault access, and secrets in debug logs.

## Verification
Demonstrate application operation after rotation, inspect effective permissions, and scan relevant repositories/artifacts for exposed values.

## Expected output
A lifecycle-controlled secret design, remediation evidence, and rotation runbook.

## Stop conditions
Escalate immediately for suspected production credential compromise, signing-key exposure, or revocation that could cause material outage without coordination.