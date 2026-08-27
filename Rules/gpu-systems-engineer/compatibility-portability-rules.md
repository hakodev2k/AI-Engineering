# Compatibility and Portability Rules

## Purpose
Keep GPU software operable across supported hardware, drivers, runtimes, and deployment environments.

## Scope
Device capability checks, binary/source compatibility, feature gating, and fallback paths.

## MUST
- Supported hardware and software ranges MUST be explicit and testable.
- Architecture-specific features MUST be capability-gated.
- Required minimum driver/runtime compatibility MUST be validated before deployment.
- Unsupported configurations MUST fail with actionable diagnostics rather than undefined behavior.
- Compatibility-impacting changes MUST be tested across the declared support matrix.

## MUST NOT
- MUST NOT infer feature availability solely from product naming.
- MUST NOT silently drop correctness requirements on older supported devices.
- MUST NOT remove a supported platform without an approved deprecation process.

## SHOULD
- Isolate vendor- or architecture-specific code behind narrow interfaces.
- Maintain a correctness-first fallback for optional acceleration features.

## Exceptions
Narrowing support requires usage evidence, migration guidance, impact assessment, and approval.

## Verification
Run matrix CI, capability tests, deployment smoke tests, fallback tests, and review documented support boundaries.