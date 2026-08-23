# Credential and Secret Handling

## Purpose
Use engagement credentials, tokens, keys, and discovered secrets safely without creating new exposure or retaining unnecessary sensitive material.

## When to use
Use whenever testing requires supplied credentials or reveals authentication material during authorized validation.

## Inputs
Credential source, permitted identities, secret-handling policy, approved storage, rotation contacts, and engagement scope.

## Context to inspect
Inspect privilege level, environment, expiration, storage path, logging behavior, evidence needs, and whether a discovered secret belongs to an in-scope identity.

## Core knowledge
Credentials are high-risk evidence. Minimize access, avoid plaintext persistence, prevent shell/history/log leakage, and never reuse discovered secrets outside explicitly authorized targets. Discovery does not expand scope.

## Procedure
1. Inventory provided test credentials and intended privileges.
2. Store them only in approved secret mechanisms.
3. Prevent accidental inclusion in commands, screenshots, logs, or reports where possible.
4. Use least-privileged identities for each test.
5. If a secret is discovered, record minimal metadata before using it.
6. Confirm ownership and authorization before validation.
7. Avoid bulk credential collection.
8. Redact evidence while preserving proof.
9. Notify immediately when exposure meets engagement thresholds.
10. Rotate/revoke temporary credentials and securely delete retained material at completion.

## Decision points
Often possession/location of a valid-looking secret plus controlled verification is enough; do not access unrelated resources to prove broad impact.

## Common failure patterns
Committing test secrets, copying tokens into tickets, harvesting credentials for convenience, testing leaked third-party credentials, and failing to revoke temporary accounts.

## Verification
Search engagement artifacts for accidental secrets, confirm temporary credentials are revoked/rotated, and verify evidence is sanitized.

## Expected output
Minimal credential-use records and sanitized finding evidence with completed cleanup/rotation actions.

## Stop conditions
Stop before using a credential whose ownership/scope is uncertain, or when secure storage and approved handling cannot be maintained.