# Compatibility and Portability Rules

## Purpose
Prevent architecture, configuration, compiler, hardware, and version assumptions from causing regressions.

## Scope
CPU architectures, endianness, word size, alignment, configuration variants, compiler behavior, and supported hardware.

## MUST
- Architecture-dependent assumptions MUST be isolated and documented.
- Integer widths, alignment, endianness, and signedness MUST be explicit where data crosses hardware or ABI boundaries.
- Changes MUST compile and behave correctly across relevant supported configuration variants.
- Feature detection MUST use authoritative capability mechanisms rather than model-name assumptions where possible.
- Compatibility changes MUST identify affected users, modules, devices, or interfaces.

## MUST NOT
- MUST NOT assume pointer size equals a specific integer width.
- MUST NOT rely on undefined language behavior or compiler accidents.
- MUST NOT silently drop support for a documented architecture or configuration.
- MUST NOT encode hardware quirks as universal behavior.

## SHOULD
- Prefer common abstractions with small architecture-specific implementations.
- Configuration-dependent code SHOULD be exercised by automated build matrices.
- Byte-order conversion SHOULD occur at clear boundaries.

## Exceptions
Exceptions require explicit supported-platform scope, evidence, migration implications, and maintainer approval.

## Verification
Use multi-architecture builds, configuration matrices, static analysis, emulation/hardware tests where practical, structure-layout checks, and compatibility regression suites.