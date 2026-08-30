# Developer Experience Rules

## Purpose
Ensure the build system gives engineers fast, predictable, and understandable workflows without sacrificing correctness.

## Scope
Applies to local commands, target discovery, diagnostics, onboarding, incremental workflows, IDE integration, and common developer tasks.

## MUST
- Supported developer workflows MUST have documented, stable entry points.
- Common build failures MUST provide actionable guidance that identifies the failing target or prerequisite.
- Local and CI build semantics MUST remain aligned unless a difference is explicitly documented.
- Build changes that materially increase common workflow latency MUST include evidence and justification.
- Deprecated commands or target patterns MUST have a migration path before removal.

## MUST NOT
- MUST NOT require undocumented machine preparation for normal supported workflows.
- MUST NOT trade correctness for a superficially faster developer command.
- MUST NOT introduce multiple equivalent entry points with conflicting behavior unless their distinction is intentional and documented.

## SHOULD
- Frequently used commands SHOULD optimize for low no-op and incremental latency.
- Build documentation SHOULD be generated or validated from authoritative configuration where practical.

## Exceptions
Specialized workflows MAY require additional setup, but the setup, ownership, and supported use cases MUST be explicit.

## Verification
Run onboarding and common workflow scenarios in a clean environment, inspect help and diagnostics, compare local and CI outcomes, and monitor developer-facing latency.