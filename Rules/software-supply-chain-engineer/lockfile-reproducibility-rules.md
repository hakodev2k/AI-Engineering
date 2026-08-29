# Lockfile and Reproducibility Rules

## Purpose
Make dependency resolution deterministic and builds repeatable enough to detect unintended supply-chain drift.

## Scope
Applies to package manifests, lockfiles, build inputs, generated dependency metadata, and release builds.

## MUST
- Release builds MUST use committed or otherwise controlled dependency resolution metadata where the ecosystem supports it.
- Lockfile changes MUST be reviewed as code and correlated with intended dependency changes.
- Build inputs that affect released artifacts MUST be versioned or immutably identified.
- Reproducibility gaps that prevent deterministic verification MUST be documented for critical releases.

## MUST NOT
- MUST NOT allow routine release builds to resolve unconstrained dependency versions from mutable upstream state.
- MUST NOT discard lockfile changes from review because they are generated.

## SHOULD
- Critical artifacts SHOULD be reproducibly buildable across clean environments.
- Build timestamps and nondeterministic metadata SHOULD be normalized where feasible.

## Exceptions
Exceptions MUST document the nondeterministic input, rationale, risk, compensating validation, and owner.

## Verification
Rebuild selected releases from clean environments, compare dependency graphs and artifact digests where deterministic, and review lockfile diffs in CI and code review.