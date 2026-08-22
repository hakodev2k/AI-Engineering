# Dependency Rules

## Purpose
Control supply-chain, maintenance, compatibility, and bundle risk from frontend dependencies.

## Scope
npm-compatible packages, Vue plugins, build tools, UI libraries, and dependency upgrades.

## MUST
- New dependencies MUST have a clear capability need and be evaluated for maintenance health, license, security, bundle/runtime cost, and ecosystem compatibility.
- Lockfiles MUST be committed and dependency changes MUST be reviewable.
- Security-critical dependency advisories MUST be assessed by exploitability and exposure, not ignored solely because no upgrade is convenient.
- Major framework/plugin upgrades MUST have migration, regression, and rollback planning proportional to impact.
- Deprecated dependencies on critical paths MUST have an explicit disposition.

## MUST NOT
- Packages MUST NOT be added for trivial functionality when their risk/cost materially exceeds implementation value.
- Dependency upgrades MUST NOT be declared safe based only on successful installation or compilation.
- Untrusted install scripts or packages MUST NOT receive unnecessary CI or developer credentials.

## SHOULD
- Keep framework ecosystem packages within supported compatibility ranges.
- Prefer well-maintained dependencies with narrow, composable APIs.

## Exceptions
Legacy packages may remain when replacement risk is higher, provided exposure, compensating controls, and migration ownership are documented.

## Verification
Use lockfile diff review, vulnerability/license scanning, bundle analysis, compatibility tests, and release regression suites.