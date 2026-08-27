# Dependency and Model Supply Chain Rules

## Purpose
Control provenance and security risk from code packages, pretrained models, tokenizers, datasets, and artifacts.

## Scope
Third-party dependencies, model hubs, serialization, licenses, integrity, vulnerability response, and artifact promotion.

## MUST
- Third-party model and dataset provenance, license, version, and integrity information MUST be recorded before production use.
- Untrusted model artifacts MUST be handled as potentially executable or malicious, especially unsafe serialization formats.
- Runtime dependencies MUST be pinned or otherwise reproducibly resolved for production builds.
- Known critical vulnerabilities or compromised artifacts MUST have a documented response before release.

## MUST NOT
- MUST NOT execute arbitrary code from model repositories merely to load a model without security review.
- MUST NOT use artifacts of unknown origin in production.
- MUST NOT bypass license or security review to accelerate experimentation into deployment.

## SHOULD
- Safer serialization and verified artifact registries SHOULD be preferred.
- Dependency updates SHOULD be isolated and evaluated for quality and runtime regressions.

## Exceptions
High-risk dependencies require documented necessity, sandboxing or compensating controls, security approval, and replacement plan.

## Verification
Inspect lockfiles, SBOM/dependency scans, artifact hashes, provenance records, license review, loading configuration, registry permissions, and vulnerability reports.