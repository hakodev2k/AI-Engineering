# Security and Compliance Migration

## Purpose
Preserve or improve required security and compliance controls while workloads cross environments and operating models.

## When to use
Use during migration design, landing-zone validation, data movement, cutover, and source decommissioning.

## Inputs
Data classification, regulatory/control requirements, threat model, IAM design, network controls, encryption/key model, logging, vulnerability findings, and exception process.

## Preconditions
Applicable policies and accountable security/compliance owners must be identified.

## Context to inspect
Inspect identities, service accounts, privileged access, network exposure, encryption, KMS/HSM, secrets, certificates, audit logging, retention, vulnerability management, images, backups, and data residency.

## Core knowledge
Migration creates temporary attack surface: duplicate environments, broad replication access, temporary firewall rules, copied secrets, and elevated operator privileges. Control evidence must follow the workload into the target.

## Procedure
1. Map source controls to target controls and responsible owners.
2. Identify migration-specific threats and temporary access.
3. Validate identity federation and least privilege.
4. Validate network segmentation and egress.
5. Protect migration data in transit and at rest.
6. Establish target key, secret, and certificate lifecycle.
7. Enable audit logs before production data arrives.
8. Validate vulnerability, patching, image, and dependency controls.
9. Confirm residency, retention, backup, and deletion requirements.
10. Test detection and incident-response integrations.
11. Document approved exceptions with expiry dates.
12. Remove temporary privileges and rules after stabilization.
13. Capture evidence needed for audit or control attestation.

## Decision points
Use native cloud controls when they meet requirements and reduce operational burden; retain external controls when cross-environment consistency or regulation requires them. Prefer short-lived migration credentials over static secrets.

## Common failure patterns
Security added after cutover; broad temporary rules never removed; logs enabled too late; secrets copied into images; unapproved regions; missing deletion evidence; source controls assumed equivalent to target controls.

## Verification
Run control checks, access tests, log verification, vulnerability scans, encryption validation, and evidence review. Confirm temporary access is removed and exceptions are tracked.

## Expected output
A control mapping, migration threat assessment, validation evidence, exception register, and post-cutover cleanup confirmation.

## Stop conditions
Stop when regulated data would enter an unapproved boundary, encryption/audit controls are absent, critical exposure is unresolved, or required exceptions lack authorization.