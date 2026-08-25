# Dependency Supply Chain Rules

## Purpose
Control software and pipeline dependency risk.

## Scope
Packages, actions, plugins, base images, build tools, and reusable pipeline components.

## MUST
- Third-party pipeline components MUST be pinned to reviewed immutable versions or digests for sensitive workflows.
- Dependencies MUST be sourced from approved registries or verified upstream sources.
- Release pipelines MUST run applicable vulnerability and integrity checks with defined severity policy.
- Critical dependency updates MUST be evaluated for compatibility and rollback.
- Exceptions to security gates MUST be time-bounded, owned, and auditable.

## MUST NOT
- MUST NOT execute unreviewed remote scripts directly in privileged pipelines.
- MUST NOT use floating versions for security-sensitive pipeline components without explicit risk acceptance.
- MUST NOT suppress scanner findings without documented disposition.

## SHOULD
- Generate and retain an SBOM for releasable artifacts where practical.
- Automated update tooling SHOULD preserve required tests and review gates.

## Exceptions
Document necessity, affected components, exposure, compensating controls, expiry, and approver.

## Verification
Inspect lockfiles and pipeline references, validate registry policy, review scanner output and waivers, confirm SBOM/provenance generation, and test blocked vulnerable inputs.