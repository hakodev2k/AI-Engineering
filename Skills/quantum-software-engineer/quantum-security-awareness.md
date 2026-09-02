# Quantum Security Awareness

## Purpose
Identify security implications of quantum computing for software systems without overstating near-term capabilities or confusing quantum software engineering with cryptographic protocol design.

## When to use
Use when quantum applications process sensitive data, when systems integrate cryptographic services, when evaluating post-quantum migration dependencies, or when reviewing provider and experiment security.

## Inputs
System architecture, data classification, cryptographic dependencies, provider model, credential flow, threat model, and retention requirements.

## Context to inspect
Secrets handling, API credentials, result storage, network paths, cryptographic algorithms, long-lived confidential data, provider access controls, and supply-chain dependencies.

## Core knowledge
Large fault-tolerant quantum computers would threaten widely deployed public-key schemes through algorithms such as Shor's, while symmetric security is affected differently. Post-quantum cryptography is distinct from quantum cryptography. Quantum cloud workflows also inherit conventional security risks: credentials, authorization, data leakage, dependency compromise, and insecure artifact storage.

## Procedure
1. Define sensitive assets and trust boundaries.
2. Inventory quantum-provider credentials and access paths.
3. Identify cryptographic dependencies in the surrounding system.
4. Flag long-lived data exposed to harvest-now-decrypt-later risk.
5. Ensure secrets are never embedded in circuits, source code, logs, or notebooks.
6. Review provider data-retention and tenancy assumptions.
7. Apply least privilege to submission and result-access roles.
8. Track post-quantum migration requirements through the owning security architecture process.
9. Review dependencies and SDK supply-chain risk.
10. Document which risks are current conventional risks versus future quantum-capability risks.

## Decision points
Escalate cryptographic migration decisions to qualified security owners. Prioritize present credential and data-protection weaknesses even when future quantum risk is strategically important.

## Common failure patterns
Claiming that all encryption is broken by quantum computing, confusing PQC with QKD, exposing provider tokens in notebooks, ignoring raw-result sensitivity, and making cryptographic changes without organization-wide compatibility planning.

## Verification
Run secret scanning, inspect access policies, verify encrypted storage and transport, review dependency provenance, and confirm cryptographic findings with security specialists.

## Expected output
A scoped quantum-security assessment with current controls, future migration dependencies, and clearly separated risk horizons.

## Stop conditions
Stop when cryptographic changes require security approval, provider assurances are unavailable, or sensitive-data handling violates organizational policy.