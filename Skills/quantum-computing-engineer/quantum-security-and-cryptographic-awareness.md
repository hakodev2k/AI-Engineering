# Quantum Security and Cryptographic Awareness

## Purpose
Evaluate security implications of quantum systems and avoid unsafe handling of credentials, provider access, sensitive datasets, and cryptographic claims.

## When to use
Use when quantum workloads touch protected data, cloud providers, cryptographic applications, or migration planning.

## Inputs
Threat model, data sensitivity, provider architecture, credential flow, cryptographic dependencies, compliance constraints.

## Context to inspect
Secrets storage, data residency, tenant isolation, job/result retention, API permissions, post-quantum migration requirements, and export/compliance obligations.

## Core knowledge
Quantum computing does not automatically break all cryptography. Risk depends on algorithm, key sizes, future fault-tolerant capability, and harvest-now-decrypt-later exposure.

## Procedure
1. Classify data and credentials used by the workflow.
2. Apply least privilege to provider and storage access.
3. Keep secrets out of notebooks, circuits, logs, and result artifacts.
4. Review provider retention and residency controls.
5. Identify cryptographic assets exposed to long-term quantum risk.
6. Separate present capability from future threat scenarios.
7. Use approved post-quantum migration guidance where required.
8. Document security assumptions and residual risks.

## Decision points
Prioritize PQC migration for long-lived sensitive data and protocols with long replacement cycles; avoid speculative emergency changes without standards support.

## Common failure patterns
Embedding API keys, overstating Shor-related current risk, confusing QKD with general security, and sending sensitive datasets to unapproved providers.

## Verification
Review access logs, secret scans, retention settings, and cryptographic inventory against policy.

## Expected output
A security-reviewed quantum workflow and evidence-based cryptographic risk assessment.

## Stop conditions
Stop when provider controls violate policy, secrets are exposed, or cryptographic changes require security approval.