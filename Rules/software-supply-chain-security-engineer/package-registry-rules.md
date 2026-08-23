# Package Registry Rules

## Purpose
Prevent dependency confusion, typosquatting, unauthorized publication, and untrusted package retrieval.

## Scope
Public and private package registries, mirrors, proxies, namespaces, and publishing credentials.

## MUST
- Approved package sources and namespace ownership MUST be explicitly defined.
- Internal package names that could collide with public registries MUST be protected against dependency-confusion attacks.
- Package publishing identities MUST use least privilege and strong authentication.
- Registry configuration MUST enforce trusted source resolution and documented precedence.
- Critical packages SHOULD be mirrored or cached through controlled infrastructure when availability and integrity risk justify it.

## MUST NOT
- MUST NOT configure build tooling to fall back silently to arbitrary public registries for internal package names.
- MUST NOT share package publishing credentials across unrelated teams or automation identities.
- MUST NOT publish from developer workstations when a controlled release pipeline is available.

## SHOULD
- Registry access SHOULD be auditable and publication SHOULD require protected workflows.

## Exceptions
Exceptions require risk analysis, explicit owner, time-bounded approval, and compensating source-validation controls.

## Verification
Inspect registry configuration, namespace ownership, package-source precedence, publication logs, credentials, and dependency-resolution tests.