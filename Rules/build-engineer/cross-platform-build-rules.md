# Cross-Platform Build Rules

## Purpose
Ensure build behavior remains correct across supported operating systems, architectures, and execution environments.

## Scope
Applies to path handling, shells, line endings, filesystems, architecture-specific flags, platform SDKs, and packaging targets.

## MUST
- Supported platforms MUST have explicit build definitions and tested toolchain compatibility.
- Build logic MUST avoid assumptions about path separators, case sensitivity, shell syntax, or executable extensions unless guarded by platform conditions.
- Architecture-specific compiler and linker options MUST be scoped to compatible targets.
- Cross-compilation MUST declare target runtime, ABI, SDK, and sysroot dependencies.
- Release artifacts MUST be tested on representative target environments.

## MUST NOT
- MUST NOT use host-specific absolute paths in reusable build logic.
- MUST NOT assume success on one platform proves correctness on another.
- MUST NOT silently substitute unsupported target SDKs or architectures.

## SHOULD
- Shared build logic SHOULD centralize platform branching to reduce divergence.
- CI SHOULD exercise the most critical supported platform matrix continuously.

## Exceptions
Exceptions require documented platform constraints, impact, supported fallback, and an owner for remediation.

## Verification
Run matrix builds, inspect target triples and SDK selection, validate produced binaries on representative systems, and compare platform-specific build logs.