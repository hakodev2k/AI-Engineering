# Randomness and Entropy Rules

## Purpose
Prevent predictable cryptographic values and entropy failures.

## Scope
Keys, IVs, nonces, salts, challenges, tokens, and protocol randomness.

## MUST
- Use cryptographically secure randomness for security-sensitive unpredictable values.
- Follow each construction's uniqueness and unpredictability requirements independently.
- Detect and fail safely on random-source failures where the platform exposes them.

## MUST NOT
- Use general-purpose PRNGs, counters, timestamps, UUID assumptions, or application hashes as substitutes for required entropy.
- Reuse nonces where the selected construction requires uniqueness.

## SHOULD
- Centralize approved randomness interfaces to reduce misuse.

## Exceptions
Deterministic values are permitted only when required by the reviewed construction and domain-separated appropriately.

## Verification
Static review, test vectors, configuration inspection, nonce-collision tests where practical, and cryptographic design review.