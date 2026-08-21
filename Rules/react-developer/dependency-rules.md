# Dependency Rules

## Purpose
Control frontend dependency risk, bundle impact, maintenance cost, and supply-chain exposure.

## Scope
Applies to npm-compatible packages, build plugins, UI libraries, polyfills, and runtime dependencies.

## MUST
- New dependencies MUST have a clear need that is not reasonably met by the platform or existing stack.
- Dependency adoption MUST review maintenance status, license, security posture, bundle/runtime impact, and transitive risk when relevant.
- Major upgrades MUST review breaking changes, migration cost, and rollback strategy.
- Lockfiles MUST remain consistent with the chosen package manager.
- Security-relevant dependency updates MUST be prioritized according to exploitability and exposure.

## MUST NOT
- MUST NOT add overlapping libraries for the same responsibility without a documented reason.
- MUST NOT ignore known critical vulnerabilities merely because the affected path is inconvenient to upgrade.
- MUST NOT execute untrusted package scripts or install sources outside approved registries without review.

## SHOULD
- Prefer mature, narrowly scoped dependencies with clear ownership.
- Prefer removing unused dependencies promptly.

## Exceptions
Document necessity, alternatives, risk, compensating controls, and review date.

## Verification
Use dependency scanners, lockfile diff review, bundle analysis, license checks, package metadata review, and targeted regression tests after upgrades.