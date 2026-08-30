# Compiler and Linker Rules

## Purpose
Manage compiler and linker configuration as controlled build infrastructure.

## Scope
Applies to compiler options, linker options, optimization modes, diagnostics, symbols, ABI settings, and platform-specific compilation behavior.

## MUST
- Options affecting correctness, ABI, optimization, diagnostics, or artifact layout MUST be centrally reviewable.
- Warning policy MUST distinguish newly introduced warnings from inherited technical debt.
- Changes to optimization or link mode MUST be validated for correctness, build time, runtime behavior, binary size, and diagnosability where relevant.
- ABI-affecting changes MUST identify downstream compatibility impact.
- Release and debug configurations MUST have intentional, documented differences.

## MUST NOT
- MUST NOT suppress broad warning classes merely to make builds appear clean.
- MUST NOT enable high-impact optimization globally without evidence that affected code remains correct.
- MUST NOT remove diagnostic metadata required by support or compliance processes.

## SHOULD
- Compiler diagnostics SHOULD be treated as structured quality signals during migrations.
- Platform-specific options SHOULD be isolated from common configuration.

## Exceptions
Any warning suppression, ABI deviation, or unusual linker option MUST include rationale, scope, owner, and verification evidence.

## Verification
Review effective compiler commands, artifact metadata, ABI checks, warning baselines, performance measurements, and representative runtime tests.