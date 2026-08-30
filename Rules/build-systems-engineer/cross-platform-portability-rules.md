# Cross-Platform Portability Rules

## Purpose
Ensure supported platforms build from the same intent without fragile platform-specific assumptions.

## Scope
Applies to operating systems, CPU architectures, path handling, filesystems, environment semantics, and platform-specific toolchains.

## MUST
- Supported platforms MUST be explicitly declared and continuously validated.
- Platform-specific behavior MUST be isolated behind clear configuration or target boundaries.
- Path rules, line endings, case sensitivity, executable permissions, and environment differences MUST be handled intentionally.
- Cross-platform targets MUST define equivalent outputs and compatibility expectations.
- Platform-specific failures MUST identify the affected platform clearly.

## MUST NOT
- MUST NOT assume one filesystem behavior or path syntax in shared build logic.
- MUST NOT silently drop support for a declared platform through an unrelated build change.
- MUST NOT spread platform-specific workarounds into common logic without documenting why they are required.

## SHOULD
- Common build logic SHOULD use platform-neutral abstractions.
- CI SHOULD include representative workers for every supported platform class.

## Exceptions
Platform-specific deviations MUST document scope, reason, compatibility impact, and removal criteria where temporary.

## Verification
Run clean builds on declared platforms, inspect path handling, compare target outputs, and review CI coverage for each supported platform.