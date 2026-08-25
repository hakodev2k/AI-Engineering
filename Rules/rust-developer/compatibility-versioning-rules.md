# Compatibility and Versioning

## Purpose
Protect downstream consumers from accidental source, binary, data, and behavioral incompatibility.

## Scope
Crate APIs, features, MSRV, serialized data, CLI behavior, protocols, and deployment compatibility.

## MUST
- Compatibility promises MUST be explicit for each supported surface.
- Breaking changes MUST have impact analysis, versioning decision, and migration guidance before release.
- Feature flags MUST have documented compatibility and interaction expectations.
- Rolling deployments MUST preserve required cross-version interoperability.

## MUST NOT
- MUST NOT treat compile success of the current repository as proof of downstream compatibility.
- MUST NOT remove or reinterpret stable behavior silently.
- MUST NOT raise minimum supported toolchain or platform versions without assessing consumers.

## SHOULD
- Use semver/API diff tooling and downstream test fixtures.
- Deprecate before removal when ecosystem constraints permit.

## Exceptions
Immediate breaking changes for critical security issues require explicit approval, communication, and mitigation guidance.

## Verification
Run semver checks, compile downstream fixtures, cross-version integration tests, feature-matrix tests, and review migration documentation.