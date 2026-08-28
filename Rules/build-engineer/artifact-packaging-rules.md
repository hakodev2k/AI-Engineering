# Artifact Packaging Rules

## Purpose
Ensure produced packages and archives are complete, minimal, deterministic, and suitable for downstream release processes.

## Scope
Applies to binaries, libraries, container build contexts, archives, manifests, symbols, licenses, and distribution packages.

## MUST
- Packaging rules MUST define exactly which runtime files, metadata, licenses, and generated assets belong in each artifact.
- Release packages MUST exclude temporary files, credentials, developer-only data, and undeclared build outputs.
- Package version metadata MUST correspond to the source revision and release version being built.
- Artifact layouts and entry points MUST remain backward compatible unless a breaking change is explicitly approved.
- Packaging failures MUST fail the build rather than emit incomplete release artifacts.

## MUST NOT
- MUST NOT package arbitrary workspace contents by broad wildcard when a precise manifest is practical.
- MUST NOT include secrets, local configuration, or private keys in distributable artifacts.
- MUST NOT alter package contents after provenance or integrity metadata has been finalized.

## SHOULD
- Packages SHOULD be as small as practical without removing required diagnostics or compliance material.
- Archive ordering and metadata SHOULD be deterministic where formats permit.

## Exceptions
Exceptions require documented downstream requirements, security review when sensitive content is involved, and verification of final package contents.

## Verification
Inspect package manifests, list final archive contents, scan for secrets, compare expected files, validate version metadata, and install or execute the packaged output in a clean environment.