# Secrets and Sensitive Data Rules

## Purpose
Prevent credential disclosure and uncontrolled sensitive-data exposure on Linux systems.

## Scope
Applies to credentials, keys, tokens, certificates, environment variables, process arguments, files, backups, logs, and diagnostic artifacts.

## MUST
- Secrets MUST be obtained from an approved secret store or protected delivery mechanism and exposed only to required identities.
- Secret-bearing files MUST have restrictive ownership and permissions and a defined lifecycle.
- Rotation procedures MUST account for dependent services, overlap, rollback, and verification.
- Diagnostic collection MUST identify and redact credentials and sensitive payloads before wider sharing.
- Compromise or suspected disclosure MUST trigger the defined incident and rotation process.

## MUST NOT
- Secrets MUST NOT be committed to source control, shell history, tickets, ordinary logs, or command-line arguments when safer mechanisms exist.
- Private keys MUST NOT be copied between hosts merely to simplify access.
- Secret rotation in production MUST NOT be executed without authorization when it can disrupt service or invalidate clients.

## SHOULD
- Prefer short-lived credentials and machine identity over static secrets.
- Prevent secrets from appearing in process listings and crash dumps.
- Audit access to high-value secret material.

## Exceptions
A legacy mechanism requires documented necessity, exposure analysis, compensating controls, owner, and migration plan.

## Verification
Inspect permissions and process exposure, scan repositories/configuration/logs for secret patterns, validate secret-store policies, review access logs, and test rotation in a representative environment.