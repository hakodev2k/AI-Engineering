# Algorithm and Parameter Selection

## Purpose
Select standardized cryptographic primitives and parameters that meet security, interoperability, performance, and lifecycle requirements.

## When to use
Use when designing or modernizing encryption, signatures, MACs, hashes, KDFs, or key-agreement mechanisms.

## Inputs
Threat model, required security lifetime, platform capabilities, protocol standards, compliance constraints, performance targets, and interoperability needs.

## Context to inspect
Existing algorithms, libraries, hardware acceleration, peer implementations, data lifetime, migration constraints, and organization-approved crypto policy.

## Core knowledge
Security depends on primitive, mode, parameter sizes, nonce rules, protocol composition, and implementation. Prefer modern standardized constructions and maintained libraries. Avoid inventing primitives or selecting parameters solely from benchmark results.

## Procedure
1. Classify the required primitive and security property.
2. Determine security lifetime and minimum strength.
3. Identify applicable standards and platform-supported safe defaults.
4. Exclude deprecated or weak primitives and modes.
5. Select parameter sizes, modes, curves/groups, tag lengths, and KDF settings.
6. Validate nonce/IV and domain-separation requirements.
7. Check interoperability and hardware/software support.
8. Benchmark realistic workloads without weakening security.
9. Document rationale, agility requirements, and deprecation triggers.
10. Add conformance and negative tests.

## Decision points
Prefer AEAD over unauthenticated encryption. Choose asymmetric mechanisms according to protocol ecosystem, maturity, side-channel resistance, and compatibility rather than novelty. Increase password-KDF cost only within operational latency and resource budgets.

## Common failure patterns
ECB or unauthenticated encryption; truncated tags without analysis; nonce reuse; raw hashes for passwords; weak RSA sizes; arbitrary curves; SHA-1/MD5 security use; copying parameters without considering data lifetime.

## Verification
Confirm selections against current authoritative standards and library documentation. Run known-answer and interoperability tests and verify parameter enforcement.

## Expected output
A documented algorithm suite with parameters, rationale, compatibility notes, and migration/deprecation criteria.

## Stop conditions
Stop if requirements force deprecated cryptography, the target library cannot enforce safe parameters, or interoperability requires an unassessed custom construction.