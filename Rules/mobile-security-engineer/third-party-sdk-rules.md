# Third-Party SDK Rules

## Purpose
Control security, privacy, supply-chain, and operational risk introduced by mobile dependencies.

## Scope
Libraries, analytics SDKs, plugins, native modules, and transitive dependencies.

## MUST
- Inventory security-relevant third-party code, versions, provenance, permissions, network destinations, and data access.
- Review material dependency updates for security, privacy, API, and behavior changes before release.
- Remove dependencies that are unsupported, unjustifiably privileged, or no longer required.
- Monitor known vulnerabilities and vendor security advisories for production dependencies.

## MUST NOT
- Add an SDK without understanding what data and device capabilities it can access.
- Disable platform security controls to satisfy a dependency.
- Treat package popularity as security evidence.

## SHOULD
- Resolve dependency versions reproducibly according to ecosystem practice.
- Prefer smaller, maintained dependencies with clear provenance and update practices.

## Exceptions
High-risk dependencies require documented necessity, alternatives, mitigations, owner, and security approval.

## Verification
Inspect dependency graphs, manifests, runtime network behavior, permissions, vulnerability scans, and vendor documentation.