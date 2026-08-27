# CO-RE Portability

## Purpose
Make Compile Once – Run Everywhere artifacts resilient to kernel type-layout variation.

## Scope
BTF, libbpf CO-RE relocations, field/type existence checks, generated skeletons, and portable access patterns.

## MUST
- Kernel structure access MUST use CO-RE-aware mechanisms when portability is required.
- Optional fields and types MUST be guarded with existence checks before dependent behavior executes.
- Build artifacts MUST preserve the BTF information required for relocation.
- Relocation failures MUST produce actionable diagnostics and prevent unsafe activation.

## MUST NOT
- MUST NOT hard-code kernel structure offsets for portable programs.
- MUST NOT assume identical enum values, field layouts, or type presence across supported kernels.
- MUST NOT treat successful compilation as portability evidence.

## SHOULD
- Minimize dependence on internal kernel types.
- Test artifacts against diverse BTF snapshots before release.

## Exceptions
Non-CO-RE code requires a documented target boundary, reason, deployment guard, validation evidence, and rollback path.

## Verification
Run relocation/load tests using representative BTF files and live kernels; inspect generated skeletons and deliberate missing-field test cases.