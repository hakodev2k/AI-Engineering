# Cryptographic Requirements and Threat Modeling

## Purpose
Translate security goals into explicit cryptographic requirements before choosing algorithms or protocols.

## When to use
Use for new systems, protocol changes, key-handling changes, or reviews involving confidentiality, integrity, authenticity, non-repudiation, or privacy. Do not use cryptography to compensate for an undefined trust model.

## Inputs
System requirements, data classification, architecture, trust boundaries, attacker capabilities, regulatory constraints, and deployment environment.

## Context to inspect
Identify assets, actors, data flows, storage locations, trust anchors, existing crypto, key owners, lifecycle events, and operational dependencies.

## Core knowledge
Cryptography protects specific properties under explicit assumptions. Algorithm strength cannot repair endpoint compromise, poor authorization, weak randomness, key exposure, metadata leakage, or unsafe protocol composition.

## Procedure
1. Enumerate protected assets and required properties.
2. Map data at rest, in transit, and in use.
3. Define attacker capabilities and trust boundaries.
4. Identify trust anchors and key custodians.
5. Specify confidentiality, integrity, authenticity, freshness, and availability needs separately.
6. Record compliance and interoperability constraints.
7. Identify downgrade, replay, substitution, rollback, side-channel, and key-compromise scenarios.
8. Define acceptable failure behavior and recovery.
9. Prefer standardized protocols and approved primitives.
10. Produce testable security requirements and review them against the architecture.

## Decision points
Use encryption only where confidentiality is required; signatures or MACs where authenticity/integrity are required. Prefer authenticated encryption for protected messages. Distinguish identity authentication from message authenticity.

## Common failure patterns
Starting with an algorithm instead of a threat model; assuming TLS protects stored data; ignoring metadata; unclear key ownership; custom protocols; unmodeled replay or rollback; treating compliance as proof of security.

## Verification
Trace every security requirement to a threat and control. Confirm all key lifecycle events and failure modes have owners and tests. Have an independent reviewer challenge assumptions.

## Expected output
A concise cryptographic threat model, explicit security properties, trust assumptions, constraints, and acceptance criteria.

## Stop conditions
Stop and escalate when critical assets, trust boundaries, attacker assumptions, legal requirements, or key ownership cannot be established.