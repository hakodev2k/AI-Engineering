# Software Supply Chain Rules

## Purpose
Reduce risk introduced through third-party packages, build systems, artifacts, and delivery dependencies.

## Scope
Applies to package managers, build pipelines, artifact registries, base images, external libraries, and release tooling.

## MUST
- Third-party dependencies MUST have known provenance and maintained versions.
- Dependency and artifact integrity MUST be verifiable through trusted registries, checksums, signatures, or equivalent controls when available.
- Build and release credentials MUST follow least privilege.
- High-risk dependency updates MUST include compatibility and security review.
- Known critical supply-chain findings MUST block release unless explicitly risk-accepted.

## MUST NOT
- MUST NOT consume production dependencies from untrusted or ad-hoc sources.
- MUST NOT allow unreviewed pipeline changes to silently gain broad production privileges.
- MUST NOT rely solely on package popularity as evidence of trustworthiness.

## SHOULD
- Pin or lock dependency versions where reproducibility matters.
- Prefer minimal, maintained base images and regularly rebuild artifacts.

## Exceptions
Exceptions require documented provenance risk, compensating controls, owner approval, and review date.

## Verification
Use dependency scans, lockfiles, registry policy, artifact metadata, pipeline review, SBOMs where available, and release evidence.