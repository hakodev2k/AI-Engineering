# Cryptography and Signatures

## Purpose
Use cryptographic primitives without weakening their security assumptions.

## Scope
Signatures, hashing, commitments, Merkle proofs, key derivation, typed data, and cryptographic verification.

## MUST
- Use established, reviewed primitives and libraries appropriate to the target chain.
- Domain-separate signatures and commitments by protocol, chain, contract, operation, and version where replay could matter.
- Validate signer recovery, malleability constraints, nonce/expiry semantics, and message encoding.
- Specify canonical serialization for signed data.
- Test malformed proofs, wrong domains, replay attempts, and boundary encodings.

## MUST NOT
- Invent custom cryptographic algorithms.
- Sign ambiguous concatenations or human-readable strings whose encoding is not canonical.
- Treat hashes as secret values.

## SHOULD
- Prefer standardized typed-data formats when ecosystem support is mature.

## Exceptions
Novel cryptography requires specialist review, formal security assumptions, test vectors, and explicit approval.

## Verification
Use known-answer tests, cross-implementation vectors, negative signature tests, dependency review, and manual inspection of domain separation.