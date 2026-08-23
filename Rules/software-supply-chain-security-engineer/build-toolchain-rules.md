# Build Toolchain Rules

## Purpose
Control compilers, build systems, package managers, plugins, and other tools that can alter released software.

## Scope
Compilers, interpreters, build plugins, generators, package managers, linters, release tools, and CI images.

## MUST
- Security-relevant build tools MUST have approved versions and trusted distribution sources.
- Toolchain versions used for releases MUST be reproducible and traceable.
- Build plugins and generators with code-execution capability MUST be treated as dependencies with equivalent review requirements.
- Toolchain updates MUST be tested for output, compatibility, and security impact before production use.
- Unsupported toolchain components MUST have a migration or containment plan.

## MUST NOT
- MUST NOT download and execute unverified build tools from arbitrary URLs in privileged pipelines.
- MUST NOT allow mutable tool versions to change release outputs without review.
- MUST NOT assume developer-local tools are equivalent to controlled release tooling.

## SHOULD
- Release toolchains SHOULD be defined as code and isolated from developer workstations.
- Tool binaries SHOULD be integrity-verified where supported.

## Exceptions
Exceptions require documented source, reason, risk, compensating controls, owner, and expiry.

## Verification
Inspect tool manifests, pinned versions, hashes, build images, update history, support status, and release logs.