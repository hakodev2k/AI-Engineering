# Pseudonymization and Tokenization

## Purpose
Reduce exposure of direct identifiers while preserving controlled linkage needed for legitimate processing.

## When to use
Use for analytics, testing, data sharing, internal processing, research, and systems that do not need direct identity.

## Inputs
Data model, linkage requirements, threat model, access model, key management, and re-identification needs.

## Context to inspect
Inspect identifier entropy, join paths, auxiliary data, token vaults, keys, exports, and recipient capabilities.

## Core knowledge
Pseudonymous data can remain personal data because re-identification may be possible. Tokenization separates mapping from use; keyed transforms and random tokens have different operational properties.

## Procedure
1. Identify direct and quasi-identifiers.
2. Define legitimate linkage requirements.
3. Choose irreversible anonymization only when linkage is unnecessary and defensible.
4. Otherwise choose appropriate pseudonym or token design.
5. Separate mapping secrets from datasets.
6. Restrict re-identification capability.
7. Rotate or scope tokens when useful.
8. Evaluate linkage attacks using auxiliary fields.
9. Test operational recovery and revocation.

## Decision points
Use random vault-backed tokens for strong separation; deterministic tokens only when stable joins are required and leakage is understood.

## Common failure patterns
Hashing low-entropy identifiers without a secret, keeping mapping beside data, and calling reversible data anonymous.

## Verification
Attempt unauthorized linkage and confirm only approved paths can resolve identity.

## Expected output
A documented identity-separation design with bounded re-identification.

## Stop conditions
Escalate when anonymity claims cannot be supported or key custody is unclear.