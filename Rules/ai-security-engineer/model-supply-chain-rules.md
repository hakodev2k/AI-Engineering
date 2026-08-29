# Model Supply Chain Rules

## Purpose
Protect AI systems from compromised models, libraries, datasets, runtimes, registries, and build artifacts.

## Scope
Applies to third-party models, model hubs, training code, inference runtimes, plugins, containers, datasets, and artifact registries.

## MUST
- External models and packages MUST come from approved sources with documented provenance.
- Model, container, and dependency versions MUST be pinned or otherwise reproducible for production.
- Downloaded artifacts MUST be integrity-verified when hashes or signatures are available.
- Critical vulnerabilities or compromise indicators MUST be assessed before promotion to production.
- Promotion pipelines MUST preserve provenance from source through deployed artifact.

## MUST NOT
- MUST NOT deploy an unreviewed model or executable artifact directly from an internet source into production.
- MUST NOT disable signature, hash, or vulnerability checks solely to unblock a release.

## SHOULD
- Maintain an inventory of models, runtimes, datasets, and major transitive dependencies.
- Prefer signed artifacts and restricted registries.

## Exceptions
Exceptions require evidence of necessity, bounded exposure, compensating controls, expiry, and security approval.

## Verification
Inspect lockfiles, model registry metadata, hashes, signatures, SBOMs, vulnerability scans, provenance attestations, and deployment pipeline controls.