# WASI Integration Rules

## Purpose
Make WASI dependencies explicit, portable, secure, and version-aware.

## Scope
Applies to WASI interfaces, preview/version transitions, adapters, shims, and runtime configuration.

## MUST
- Supported WASI interface versions MUST be documented and tested against every supported runtime.
- Required WASI capabilities MUST be declared explicitly.
- Version migrations MUST include compatibility tests and a rollback or coexistence strategy when production workloads are affected.
- Filesystem and network access MUST be constrained to the minimum required resources.
- Runtime-specific deviations from WASI semantics MUST be documented.

## MUST NOT
- Code MUST NOT assume host paths, sockets, environment variables, clocks, or randomness are available unless explicitly provisioned.
- Preview or experimental interfaces MUST NOT be treated as stable production contracts without an explicit risk decision.
- Compatibility adapters MUST NOT silently weaken capability restrictions.

## SHOULD
- Prefer standardized WASI interfaces over proprietary host calls when they satisfy requirements.
- Keep runtime-specific integration behind narrow adapters.
- Exercise unavailable-capability and permission-denied paths in tests.

## Exceptions
A proprietary host interface may replace WASI when required functionality is unavailable or unsuitable; rationale, portability cost, security impact, and migration path must be recorded.

## Verification
Run the module/component across the supported runtime matrix, inspect WASI imports and grants, execute denial-path tests, and compare configured capabilities with documented requirements.