# Randomness and Entropy Engineering

## Purpose
Design and review secure randomness for keys, nonces, salts, challenges, tokens, and protocol state.

## When to use
Use whenever security depends on unpredictability or uniqueness, especially during boot, container cloning, VM snapshots, embedded startup, or high-throughput generation.

## Inputs
Platform RNG facilities, deployment model, generated object types, throughput, startup behavior, and failure requirements.

## Context to inspect
OS CSPRNG APIs, hardware RNG use, seeding, fork/snapshot behavior, entropy sources, deterministic test hooks, and any custom PRNG code.

## Core knowledge
A CSPRNG must be seeded from adequate entropy and used according to platform guarantees. Uniqueness and unpredictability are different requirements. Nonce rules depend on the construction; some require strict uniqueness, others random selection with bounded collision risk.

## Procedure
1. Inventory every random or unique value used by security code.
2. Classify each value as secret, unpredictable, unique, or both.
3. Prefer the OS/platform CSPRNG and remove ad-hoc PRNGs.
4. Review boot, fork, clone, and snapshot behavior.
5. Define nonce generation according to the selected primitive.
6. Keep test determinism isolated from production paths.
7. Handle RNG failures explicitly; never silently downgrade.
8. Test concurrency and high-volume collision assumptions.
9. Document entropy dependencies and operational monitoring.

## Decision points
Use counters for nonces when durable uniqueness can be guaranteed; otherwise use a construction-compatible random strategy. Hardware RNG output should normally feed a vetted DRBG rather than be trusted blindly.

## Common failure patterns
Math/random APIs for keys; timestamp-derived tokens; nonce reuse; deterministic seeds in production; VM clones duplicating PRNG state; ignoring RNG errors; confusing salts with secrets.

## Verification
Static-review all randomness call sites, run collision/property tests where meaningful, and validate platform behavior across restart, fork, snapshot, and concurrency scenarios.

## Expected output
A documented randomness design with safe APIs, nonce strategy, failure behavior, and tests.

## Stop conditions
Stop when adequate entropy cannot be established or platform lifecycle behavior makes uniqueness guarantees unverifiable.