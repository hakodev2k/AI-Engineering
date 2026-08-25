# Cryptographic Code Review

## Purpose
Review application cryptography for misuse of otherwise secure libraries, unsafe defaults, secret exposure, and lifecycle defects.

## When to use
Use for pull requests, security assessments, library migrations, incident follow-up, and sensitive feature reviews.

## Inputs
Code, dependencies, configuration, threat model, data formats, tests, and deployment architecture.

## Context to inspect
All crypto call sites, key sources, randomness, serialization, error handling, logs, configuration overrides, dependency versions, and persistence formats.

## Core knowledge
Most application crypto failures are misuse and composition errors: wrong modes, nonce reuse, weak derivation, missing authentication, bad validation, secret logging, or broken key lifecycle.

## Procedure
1. Inventory cryptographic operations and dependencies.
2. Trace every key from generation to destruction.
3. Verify algorithms and parameters against policy.
4. Review nonce/IV/salt generation and uniqueness assumptions.
5. Confirm authentication before plaintext use.
6. Check KDF/domain separation and key reuse.
7. Review certificate/signature validation semantics.
8. Search logs, errors, dumps, and telemetry for secret leakage.
9. Validate versioned formats and migration paths.
10. Add focused negative tests for each identified invariant.

## Decision points
Prefer deleting redundant custom crypto over patching it. If a maintained high-level API can encode invariants, migrate rather than relying on reviewer discipline.

## Common failure patterns
Copy-pasted crypto snippets; deprecated algorithms; static IVs; catch-and-ignore authentication errors; broad trust stores; plaintext secrets in debug logs; no rotation/version metadata.

## Verification
Build and test, run static/dependency analysis where available, inspect negative cases, and trace representative data/key lifecycles end to end.

## Expected output
Prioritized findings with exploit conditions, affected properties, remediation, regression tests, and residual risk.

## Stop conditions
Stop before approving if critical cryptographic invariants cannot be verified, required context is missing, or novel primitives/protocols require specialist analysis.