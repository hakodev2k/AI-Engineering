# Security and Access Reliability

## Purpose
Protect databases with least privilege and resilient access controls without turning identity failures into avoidable outages.

## When to use
Use for access design, credential rotation, privileged operations, audit findings, or authentication incidents.

## Inputs
Identity architecture, roles, service accounts, secrets, network controls, audit requirements, and break-glass policy.

## Context to inspect
Grants, inherited permissions, authentication dependencies, secret rotation, TLS, network paths, audit logs, and emergency access.

## Core knowledge
Database security and reliability interact: overprivilege increases blast radius while brittle authentication or rotation can cause outages.

## Procedure
1. Inventory human and workload identities.
2. Map required operations to least-privilege roles.
3. Remove unused and shared credentials.
4. Prefer short-lived or managed credentials where supported.
5. Automate rotation with overlap and validation.
6. Protect transport and administrative paths.
7. Define audited break-glass access.
8. Monitor privilege and authentication anomalies.
9. Test rotation and identity-provider failure scenarios.

## Decision points
Use centralized identity when reliability and integration are adequate; retain tightly controlled emergency access for control-plane failure.

## Common failure patterns
Permanent admin credentials, rotation without overlap, application ownership privileges, unaudited break-glass accounts, and hard-coded secrets.

## Verification
Validate permissions with positive and negative tests, rotate credentials safely, and exercise emergency access controls.

## Expected output
Least-privilege access model, resilient credential lifecycle, audit evidence, and emergency procedure.

## Stop conditions
Escalate privilege expansion, production lockout risk, missing ownership, or changes affecting regulated access controls.