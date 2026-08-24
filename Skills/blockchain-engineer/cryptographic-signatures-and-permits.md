# Cryptographic Signatures and Permits

## Purpose
Design and verify off-chain authorization flows that rely on digital signatures, typed data, nonces, domains, and expiration.

## When to use
Use for permits, meta-transactions, delegated actions, signed orders, authentication, and cross-system authorization.

## Inputs
Signer model, message schema, chain IDs, verifying contracts, nonce rules, expiry policy, replay boundaries.

## Preconditions
The authorization semantics and trusted signer identities are explicit.

## Context to inspect
EIP-712 domain construction, signature recovery, smart-contract wallets, nonce storage, chain forks, proxy addresses, and replay behavior.

## Core knowledge
A signature proves control of a key over bytes, not business intent. Secure protocols bind signatures to action, parameters, domain, chain, verifying contract, nonce, and time or state constraints.

## Procedure
1. Define the exact signed intent and parameters.
2. Use structured typed data when ecosystem support permits.
3. Bind the message to chain and verifying contract.
4. Define one-time or scoped nonce semantics.
5. Add expiration where stale authorization is dangerous.
6. Validate recovered signer or contract-wallet signature.
7. Mark nonce consumed before risky external effects.
8. Test replay across chains, contracts, users, and operations.
9. Document key rotation and compromised-signer response.

## Decision points
Use monotonic nonces for ordered authorization; use bitmap/random nonce strategies for parallel independent actions when complexity is justified.

## Common failure patterns
Missing domain separation, reusable signatures, ambiguous encoding, signing display text instead of exact parameters, and assuming every wallet uses ECDSA recovery.

## Verification
Negative tests must prove altered parameters, wrong chain/domain, expired signatures, and reused nonces are rejected.

## Expected output
Documented signed-message contract, implementation, replay controls, and verification evidence.

## Stop conditions
Escalate when signature semantics are ambiguous or required wallet types cannot be safely validated.