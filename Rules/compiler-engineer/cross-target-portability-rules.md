# Cross-Target Portability Rules

## Purpose
Prevent host assumptions from contaminating target behavior.

## Scope
Cross compilation, endianness, word size, target triples, feature detection, data layout, and toolchain selection.

## MUST
- Target properties MUST come from explicit target configuration, not the host process.
- Data layout MUST account for target width, alignment, endianness, and ABI.
- Feature-dependent codegen MUST validate declared target capabilities.
- Cross-target tests MUST include at least one configuration materially different from common developer hosts.

## MUST NOT
- MUST NOT use host `sizeof`, endianness, filesystem conventions, or CPU features as target truth.
- MUST NOT silently fall back to a different target when configuration is invalid.
- MUST NOT emit host-specific paths into target artifacts unless explicitly requested.

## SHOULD
- Target descriptions SHOULD centralize authoritative properties.
- Unsupported combinations SHOULD fail early with actionable diagnostics.

## Exceptions
Host-equals-target shortcuts require proof that they are confined to native-only modes.

## Verification
Use cross-compilation CI, emulator/hardware execution, object inspection, target-matrix tests, and configuration audits.