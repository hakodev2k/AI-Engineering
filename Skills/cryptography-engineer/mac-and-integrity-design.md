# MAC and Integrity Design

## Purpose
Apply message authentication codes correctly for symmetric integrity and authenticity.

## When to use
Use for trusted-service messages, stored metadata, protocol records, or tokens where symmetric key sharing is acceptable and confidentiality is not necessarily required.

## Inputs
Message format, trust relationships, key distribution model, replay requirements, algorithm policy, and throughput targets.

## Context to inspect
Serialization, key reuse, truncation, comparison functions, replay state, domain separation, and error behavior.

## Core knowledge
A MAC authenticates bytes under a shared secret. It does not provide confidentiality or public verifiability. Key separation and canonical message framing are essential; naive concatenation can create ambiguity.

## Procedure
1. Confirm symmetric authenticity matches the trust model.
2. Choose a standardized MAC or AEAD when confidentiality is also needed.
3. Define canonical, length-safe message encoding.
4. Derive a purpose-specific MAC key.
5. Include protocol/version/context fields.
6. Define acceptable tag length based on standard guidance and attack volume.
7. Verify tags before processing authenticated semantics.
8. Use constant-time comparison APIs.
9. Add sequence, nonce, or timestamp state when replay matters.
10. Test malformed, truncated, replayed, and cross-context messages.

## Decision points
Prefer AEAD when encrypting the same payload. Prefer signatures when independent/public verification is required. Truncate tags only when protocol constraints justify it and security bounds are understood.

## Common failure patterns
Using raw hashes as MACs; sharing one key across purposes; ambiguous concatenation; short tags; non-constant-time comparison; treating MAC as anti-replay; logging secret keys.

## Verification
Mutate every authenticated field, test wrong keys and contexts, confirm replay controls, and inspect key separation and comparison APIs.

## Expected output
A symmetric integrity design with message framing, key derivation, tag policy, replay controls, and tests.

## Stop conditions
Stop if shared-key trust is inappropriate, key distribution is unresolved, or message canonicalization cannot be defined safely.