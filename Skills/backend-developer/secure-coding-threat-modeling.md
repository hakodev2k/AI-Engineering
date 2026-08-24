# Secure Coding and Threat Modeling

## Purpose
Identify backend attack paths early and implement controls proportional to realistic threats.

## When to use
Use for new trust boundaries, sensitive data, file handling, administrative features, integrations, or security reviews.

## Inputs
Architecture, data classification, actors, entry points, dependencies, deployment model, security requirements.

## Context to inspect
Input validation, serialization, file/URL handling, database access, secrets, authorization, logging, dependency versions, and network boundaries.

## Core knowledge
Trust boundaries, STRIDE-style reasoning, injection, SSRF, deserialization risk, path traversal, mass assignment, secret handling, encryption, and OWASP classes.

## Procedure
1. Map assets, actors, entry points, and trust boundaries.
2. Enumerate plausible abuse paths.
3. Rank by impact and exploitability.
4. Prefer eliminating dangerous capability over filtering it.
5. Validate inputs at trust boundaries and parameterize interpreters.
6. Apply least privilege to identities and data access.
7. Protect secrets and sensitive logs.
8. Add targeted security tests and monitoring.
9. Record residual risk and ownership.

## Decision points
Use allowlists for constrained inputs where feasible; isolate high-risk parsing/execution; encrypt based on data sensitivity and threat model rather than checkbox compliance.

## Common failure patterns
Blacklist validation, trusting internal traffic, logging credentials, constructing SQL/shell commands, unrestricted outbound URLs, and treating scanners as proof of security.

## Verification
Execute abuse-case tests, dependency/security scans, authorization negatives, and manual review of trust boundaries and sensitive flows.

## Expected output
Threat-informed controls, tests, and documented residual risks.

## Stop conditions
Stop and escalate credible high-impact vulnerabilities, unclear data-classification obligations, or changes requiring security exception approval.