# Federated Threat Modeling

## Purpose
Identify trust boundaries, attacker capabilities, sensitive assets, and mitigations specific to federated-learning systems.

## When to use
Use during architecture design, before production rollout, after introducing new client types, or after a security incident.

## Inputs
System architecture, client enrollment model, coordinator design, aggregation protocol, update transport, model distribution path, identities, secrets, and operational logs.

## Context to inspect
Inspect compromised clients, malicious coordinators, colluding participants, poisoned updates, sybil attacks, model inversion, membership inference, replay, downgrade, and metadata leakage.

## Core knowledge
FL expands the attack surface across clients and coordinator infrastructure. Privacy and integrity are separate: hiding updates does not prevent poisoning, and robust aggregation does not guarantee confidentiality.

## Procedure
1. Inventory assets: data, updates, model, identities, keys, and metadata.
2. Draw trust boundaries and data flows.
3. Enumerate attacker classes and privileges.
4. Analyze enrollment and identity abuse.
5. Analyze confidentiality threats to updates and models.
6. Analyze integrity threats including poisoning, sybils, replay, and rollback.
7. Evaluate availability attacks and resource exhaustion.
8. Map each material threat to preventive, detective, and recovery controls.
9. Prioritize by likelihood, impact, and detectability.
10. Convert assumptions into testable security requirements.

## Decision points
Use cryptographic confidentiality controls for update secrecy, robust/statistical defenses for malicious updates, and identity/rate controls for sybil resistance. No single control covers all three.

## Common failure patterns
- Assuming all clients are honest.
- Treating TLS as sufficient protection.
- Ignoring metadata leakage.
- Failing to model coordinator compromise.
- Mitigations with no detection or response path.

## Verification
Review the model with security and platform stakeholders; test high-risk attack paths and verify controls produce observable evidence.

## Expected output
A federated threat model with trust boundaries, prioritized threats, mitigations, residual risks, and validation tasks.

## Stop conditions
Stop if system ownership, identity model, or cryptographic trust assumptions are unknown.