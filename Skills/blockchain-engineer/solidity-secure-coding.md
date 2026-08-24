# Solidity Secure Coding

## Purpose
Implement Solidity code with defensive patterns that reduce exploitable state, authorization, arithmetic, call, and integration defects.

## When to use
Use when writing or reviewing Solidity contracts. Do not assume compiler checks or standard libraries eliminate protocol-level vulnerabilities.

## Inputs
Contract requirements, Solidity/compiler version, dependency versions, target EVM networks, threat model.

## Preconditions
The design invariants and authorization model are understood.

## Context to inspect
Compiler settings, dependencies, inheritance, modifiers, assembly, delegatecall usage, external token interactions, fallback/receive functions, and unchecked blocks.

## Core knowledge
Security depends on both language semantics and protocol behavior. Relevant risks include reentrancy, authorization bypass, signature misuse, precision loss, denial of service, front-running, unsafe delegatecall, storage mistakes, and non-standard token behavior.

## Procedure
1. Pin and review compiler/dependency versions.
2. Validate inputs and reject impossible state transitions early.
3. Apply least privilege to administrative operations.
4. Follow checks-effects-interactions where external calls exist.
5. Use pull patterns or guarded transfers where appropriate.
6. Treat all external contracts as adversarial.
7. Avoid unbounded loops over user-controlled data.
8. Review arithmetic scaling, rounding direction, and units.
9. Minimize assembly and document required invariants where unavoidable.
10. Verify signature domain separation, nonce use, and expiration.
11. Emit auditable events for meaningful state changes.
12. Add negative, fuzz, and invariant tests.

## Decision points
Use libraries for well-understood primitives; write custom low-level logic only when required and independently reviewed.

## Common failure patterns
Assuming ERC implementations are standard-compliant, missing zero-address checks where semantically required, tx.origin authorization, stale approvals, unsafe low-level calls, and incorrect decimal conversions.

## Verification
Static analysis, compiler warnings review, unit/fuzz/invariant tests, manual adversarial review, and testnet execution of high-risk flows.

## Expected output
Secure implementation plus evidence covering authorization, external-call safety, arithmetic, signatures, and invariant preservation.

## Stop conditions
Escalate if low-level behavior, cryptographic assumptions, or critical asset flows cannot be independently verified.