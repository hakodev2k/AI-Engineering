# Security Architecture

## Purpose
Embed security boundaries, trust assumptions, and controls into software architecture before vulnerabilities become implementation defaults.

## When to use
Use for new systems, sensitive workflows, identity redesign, external integrations, compliance work, or security incidents.

## Inputs
Data classification, threat model, trust boundaries, identities, permissions, external interfaces, compliance requirements.

## Context to inspect
Authentication, authorization, secrets, network boundaries, storage encryption, audit logs, dependency risk, privileged operations, and tenant isolation.

## Core knowledge
Security should be layered around assets and trust boundaries. Authentication proves identity; authorization constrains actions. Least privilege, secure defaults, defense in depth, and explicit threat modeling reduce systemic risk.

## Procedure
1. Identify assets and sensitive data.
2. Map trust boundaries and actors.
3. Enumerate likely threats and abuse cases.
4. Define identity and authorization models.
5. Minimize privileges and secret exposure.
6. Protect data in transit and at rest.
7. Define input validation and output handling at boundaries.
8. Add auditability for security-sensitive actions.
9. Review dependency and supply-chain exposure.
10. Validate controls with security tests and threat scenarios.

## Decision points
Prefer centralized policy where consistency is critical, but enforce authorization close to protected resources. Use stronger isolation when tenant or data sensitivity warrants the cost.

## Common failure patterns
Authentication without authorization, shared admin credentials, implicit trust between services, secrets in configuration, insecure defaults, missing audit trails, and security checks only at UI level.

## Verification
Threat model reviewed, access tests pass, privilege boundaries are exercised, sensitive data handling is validated, and audit evidence exists.

## Expected output
A security architecture with explicit trust boundaries, controls, assumptions, and verification evidence.

## Stop conditions
Stop when legal/compliance interpretation, identity ownership, or required security approval is missing.