# Password Hashing and Secret Verification

## Purpose
Store and verify human-memorable passwords and similar low-entropy secrets using appropriate password-hashing defenses.

## When to use
Use for password credential storage or migration. Do not use reversible encryption for passwords that only need verification.

## Inputs
Authentication requirements, latency budget, server resources, user volume, existing hash formats, and migration constraints.

## Context to inspect
Current algorithms and cost parameters, salt generation, optional pepper handling, login rate limits, reset flows, backups, and credential breach response.

## Core knowledge
Passwords have low entropy and require slow, preferably memory-hard password hashing with unique salts. Work factors must be benchmarked on production-class hardware and upgraded over time.

## Procedure
1. Inventory current password formats and migration paths.
2. Select an approved password-hashing algorithm supported by a maintained library.
3. Benchmark memory/time/parallelism parameters against service budgets.
4. Generate a unique random salt per credential.
5. If using a pepper, keep it in a separate managed secret boundary.
6. Store algorithm and parameters with the verifier.
7. Use constant-time verification APIs where applicable.
8. Rehash opportunistically after successful authentication when policy changes.
9. Pair hashing with rate limiting, MFA, and secure reset controls.
10. Test legacy migration, malformed hashes, resource exhaustion, and upgrade behavior.

## Decision points
Increase cost until security benefit conflicts with authentication capacity and denial-of-service resilience. Peppering can reduce offline exposure but adds operational key-management complexity.

## Common failure patterns
SHA-256 alone; global/static salt; reversible password encryption; excessive cost causing DoS; no parameter versioning; logging passwords; forced mass reset without migration analysis.

## Verification
Benchmark representative hardware, test known credentials and malformed records, verify unique salts, and confirm automatic rehash behavior.

## Expected output
A versioned password-verification policy with parameters, migration, operational limits, and breach-response considerations.

## Stop conditions
Stop if required parameters cannot fit availability budgets or legacy migration risks credential loss without an approved recovery plan.