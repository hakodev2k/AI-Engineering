# Pseudonymization and Tokenization

## Purpose
Replace direct identifiers with controlled surrogates so AI pipelines can perform approved processing while reducing unnecessary identity exposure and preserving reversibility only where explicitly required.

## When to use
Use for training datasets, analytics, feature stores, evaluation corpora, support tooling, and cross-system joins where raw identifiers are unnecessary but record linkage is still needed.

## Inputs
- Identifier inventory
- Join and reversibility requirements
- Threat model
- Key/token vault architecture
- Retention and deletion rules

## Context to inspect
Inspect source identifiers, transformation code, lookup tables, cryptographic keys, token vaults, logs, exports, and downstream systems that may receive transformed values.

## Core knowledge
Pseudonymization reduces exposure but does not make data anonymous when a mapping, auxiliary data, or stable linkage remains. Tokenization, keyed hashing, random surrogate IDs, and format-preserving schemes serve different operational needs. Stable identifiers increase linkability risk across datasets.

## Procedure
1. Identify which direct identifiers are unnecessary for the target task.
2. Define required join scope and duration.
3. Choose random tokens, keyed hashing, or another transformation appropriate to reversibility needs.
4. Separate mapping material from transformed datasets.
5. Apply least-privilege access to keys and token vaults.
6. Scope stable tokens to the narrowest domain that supports required joins.
7. Prevent raw identifiers from leaking into logs or metadata.
8. Define rotation and revocation procedures where applicable.
9. Ensure deletion requests propagate through tokenized datasets.
10. Test re-identification risk using available auxiliary fields.
11. Document remaining linkability and trust assumptions.

## Decision points
Use random tokenization when controlled reversibility is required. Use keyed hashing for deterministic joins when the identifier domain and threat model support it. Avoid plain hashing for low-entropy values such as email addresses or phone numbers.

## Common failure patterns
- Calling pseudonymized data anonymous
- Using unsalted or unkeyed hashes for predictable identifiers
- Reusing the same token across unrelated purposes
- Storing the mapping beside the protected dataset
- Forgetting transformed copies during deletion

## Verification
Attempt unauthorized linkage with available auxiliary data, inspect key and vault access policies, verify downstream payloads, and test deletion across raw and tokenized records.

## Expected output
A documented pseudonymization design with transformation method, scope, key/vault controls, linkage limits, deletion behavior, and residual re-identification risk.

## Stop conditions
Escalate when stable linkage creates unacceptable profiling risk, key-management controls are insufficient, or the transformation is being treated as anonymization without evidence.