# Developer Build Experience Rules

## Purpose
Ensure developers can run, understand, and troubleshoot supported build workflows efficiently without bypassing correctness controls.

## Scope
Applies to local build entry points, bootstrap steps, environment setup, error messages, documentation, and common build commands.

## MUST
- Supported local build workflows MUST have stable documented entry points.
- Bootstrap steps MUST validate required toolchains and fail with actionable remediation when prerequisites are missing.
- Common developer build commands MUST preserve the same dependency and correctness semantics used by CI unless differences are explicit.
- Build configuration defaults MUST be safe and suitable for the majority of supported development workflows.
- Changes that materially slow frequent local workflows MUST include measured impact and mitigation analysis.

## MUST NOT
- MUST NOT require developers to discover hidden environment state through trial and error.
- MUST NOT make undocumented machine-specific configuration a prerequisite for normal builds.
- MUST NOT encourage disabling validation as the standard workaround for slow or unreliable builds.

## SHOULD
- Build commands SHOULD support targeted execution for common development scopes.
- Diagnostics SHOULD explain why work is rebuilding or why a target is considered out of date when practical.

## Exceptions
Exceptions require documented constraints, an explicit setup guide, expected lifetime, and ownership for improvement.

## Verification
Follow setup documentation in a clean environment, run common workflows, inspect failure guidance, and measure representative local build latency.