# Model Artifact Security

## Purpose
Secure model checkpoints, adapters, tokenizers, configuration, and serialized artifacts against tampering, unsafe loading, unauthorized disclosure, and substitution.

## When to use
Use when importing, storing, converting, signing, distributing, or loading model artifacts.

## Inputs
Artifact formats, registry/storage design, provenance metadata, loader code, signing policy, identities, and deployment process.

## Preconditions
Know the authoritative producer and expected artifact identity. Obtain isolated analysis capability for untrusted artifacts.

## Context to inspect
Inspect model registries, object storage, caches, conversion tools, serialization formats, runtime loaders, CI/CD permissions, and promotion gates.

## Core knowledge
Serialized model formats can contain executable behavior or trigger vulnerable parsers. Integrity and provenance are separate: a valid hash proves identity, not trustworthiness. Promotion should bind model bytes to source, evaluation, approval, and deployment metadata.

## Procedure
1. Inventory artifact types and loading mechanisms.
2. Classify formats by executable/deserialization risk.
3. Prefer data-only safe formats where supported.
4. Verify source provenance before download or import.
5. Compute and retain cryptographic digests.
6. Scan and inspect untrusted artifacts in isolation.
7. Disable arbitrary code execution during loading unless explicitly required and reviewed.
8. Store promoted artifacts in access-controlled immutable locations.
9. Sign or attest releases and verify at deployment.
10. Bind artifacts to evaluation results and approved configuration.
11. Restrict registry write and promotion permissions.
12. Test rollback to a known-good artifact.

## Decision points
Reject convenience formats when their code-execution risk exceeds operational benefit. Use signatures when artifacts cross organizational or trust boundaries. Require stronger provenance for models that make high-impact decisions.

## Common failure patterns
Loading arbitrary pickle-like files; trusting filenames or repository popularity; mutable production tags without immutable digest; sharing registry write credentials; promoting an artifact without its tokenizer/configuration dependency set.

## Verification
Verify deployment resolves an immutable digest, tampered artifacts fail validation, untrusted formats cannot execute code in the analysis path, and rollback restores a previously approved model.

## Expected output
A provenance-linked, integrity-verified, safely loadable artifact release with controlled promotion and rollback evidence.

## Stop conditions
Stop when artifact provenance is unknown, loading requires unreviewed code execution, signature verification fails, or the expected digest differs from the retrieved artifact.