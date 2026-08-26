# AI Supply Chain Security

## Purpose
Assess compromise paths through models, datasets, prompts, dependencies, adapters, and external services.

## Scope
Model artifacts, registries, datasets, fine-tunes, packages, containers, prompt assets, plugins, and hosted providers.

## MUST
- Identify trust and provenance requirements for security-critical AI artifacts.
- Test whether untrusted or replaced artifacts can enter build, deployment, or inference paths.
- Verify integrity and access controls at material handoff points.

## MUST NOT
- Treat a model name or repository label as proof of artifact identity.
- Replace production artifacts during testing without explicit approval and rollback.

## SHOULD
Evaluate signing, hashes, immutable references, dependency pinning, provenance, and controlled promotion.

## Exceptions
Where cryptographic provenance is unavailable, document compensating controls and residual risk.

## Verification
Inspect artifact identifiers, hashes, registry permissions, build records, dependency manifests, and deployment provenance.