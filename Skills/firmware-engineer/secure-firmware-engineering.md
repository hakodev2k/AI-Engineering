# Secure Firmware Engineering

## Purpose
Integrate product-security requirements into firmware architecture, implementation and lifecycle decisions.

## When to use
Use for security review, credential handling, update design, external interfaces or release hardening.

## Inputs
Threat model, trust boundaries, assets, platform capabilities, update lifecycle and security requirements.

## Context to inspect
External inputs, privileged operations, key/secret handling, debug access, update validation, persistence and third-party components.

## Core knowledge
Security depends on explicit trust boundaries, least privilege, authenticated state transitions and safe failure behavior. Cryptographic design should use established platform mechanisms and reviewed libraries.

## Procedure
1. Identify assets and trust boundaries.
2. Enumerate externally influenced inputs.
3. Define authorization and integrity requirements.
4. Minimize privileged code and secret exposure.
5. Validate inputs with explicit bounds.
6. Review update and recovery trust paths.
7. Remove or control production debug features.
8. Review dependencies and known issues.
9. Add negative security tests.
10. Document residual risks.

## Decision points
Prefer platform-backed security capabilities where available; custom security mechanisms require exceptional justification and specialist review.

## Common failure patterns
Hard-coded secrets, trusting transport alone, unsafe parsers, insecure recovery paths, verbose secret-bearing logs and forgotten development interfaces.

## Verification
Perform threat-model review, negative tests, dependency review and security-owner signoff for material trust changes.

## Expected output
A hardened implementation with explicit residual risk.

## Stop conditions
Escalate cryptographic, key-management or trust-root changes to qualified security ownership.