# Toolchain Versioning Rules

## Purpose
Control compiler, linker, runtime, package, and build-tool versions so builds remain predictable and supportable.

## Scope
Applies to compilers, SDKs, linkers, interpreters, build tools, code generators, package managers, and platform toolchains.

## MUST
- Production and CI toolchains MUST use explicitly declared versions or constrained version ranges.
- Toolchain upgrades MUST include compatibility testing and rollback instructions.
- Build metadata MUST record the effective toolchain versions used for release artifacts.
- Security-critical toolchain updates MUST be prioritized according to verified exposure and exploitability.

## MUST NOT
- MUST NOT rely on whatever tool version happens to be installed on a worker.
- MUST NOT perform major toolchain upgrades without impact analysis across supported targets.
- MUST NOT silently mix incompatible compiler, SDK, or linker versions.

## SHOULD
- Toolchain definitions SHOULD be centralized and reusable.
- Upgrade cadence SHOULD avoid both unsupported stagnation and unnecessary churn.

## Exceptions
Exceptions require documented compatibility constraints, risk, expected lifetime, and an owner for remediation.

## Verification
Inspect lockfiles, toolchain manifests, CI images, build logs, and release provenance. Rebuild representative targets with the declared environment.