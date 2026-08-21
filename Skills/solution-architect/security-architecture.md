# Security Architecture

## Purpose
Design security into system boundaries, identity, data flows, infrastructure, and operations rather than treating it as a late implementation review.

## When to use
Use for new systems, integrations, cloud migrations, sensitive data, external exposure, and major architecture changes.

## Inputs
Data classification, actors, trust boundaries, threat model, identity systems, compliance obligations, deployment topology.

## Preconditions
System context and sensitive assets are known.

## Context to inspect
Authentication flows, authorization model, secrets, network paths, encryption, audit logging, admin operations, third parties, supply chain, incident response.

## Core knowledge
Use defense in depth, least privilege, explicit trust boundaries, secure defaults, strong identity, protected secrets, auditable privileged actions, and data minimization.

## Procedure
1. Identify assets and sensitive data.
2. Map trust boundaries and attack surfaces.
3. Define identity and authentication model.
4. Define authorization at resource and action boundaries.
5. Minimize and protect secrets.
6. Define encryption in transit and at rest.
7. Design network and service-to-service controls.
8. Add validation, abuse controls, rate limits, and secure error handling.
9. Define auditability, monitoring, and incident signals.
10. Review privileged operations and recovery paths.
11. Validate threats with security specialists for high-risk systems.

## Decision points
Prefer managed identity over long-lived credentials. Use network isolation as defense in depth, not as a replacement for authorization.

## Common failure patterns
Perimeter-only security, hidden admin bypasses, secrets in configuration, excessive privileges, missing audit logs, trusting internal traffic by default.

## Verification
Threat scenarios, authorization tests, secret scans, configuration review, and security acceptance criteria pass.

## Expected output
Security architecture with trust model, controls, and verification plan.

## Stop conditions
Stop when required security approval, legal interpretation, or privileged access is unavailable.