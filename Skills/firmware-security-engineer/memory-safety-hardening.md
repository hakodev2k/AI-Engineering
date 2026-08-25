# Memory Safety Hardening

## Purpose
Reduce exploitable memory corruption in firmware through language, compiler, runtime, API, and review controls appropriate to constrained systems.

## When to use
Use for C/C++ firmware, parser/driver review, crash investigation, security hardening, or migration of high-risk components to memory-safe implementations.

## Inputs
Source, toolchain, linker map, target architecture, compiler flags, memory layout, crash dumps, static-analysis results, fuzz findings, and performance constraints.

## Preconditions
Establish reproducible builds and warnings. Know target support for MPU/MMU, stack guards, execute-never, CFI, sanitizers, and safe-language runtimes.

## Context to inspect
Untrusted input boundaries, buffer operations, integer arithmetic, pointer ownership, lifetimes, DMA buffers, interrupt/shared state, allocators, stacks, linker sections, and privileged code.

## Core knowledge
Firmware exploitation commonly combines spatial/temporal memory errors with weak isolation. Prevention is stronger than detection: safe abstractions and memory-safe languages should be preferred for suitable components. Compiler hardening and MPU boundaries add defense in depth but do not repair unsafe logic.

## Procedure
1. Identify externally influenced and privilege-sensitive code paths.
2. Enable maximum practical warnings and static analysis.
3. Replace unbounded string/memory operations with length-aware interfaces.
4. Validate lengths, offsets, counts, and integer conversions before pointer arithmetic.
5. Clarify ownership and lifetime for buffers crossing tasks, interrupts, DMA, or drivers.
6. Remove use-after-free/double-free patterns and unnecessary dynamic allocation.
7. Enable stack protection, execute-never, read-only sections, CFI/fortification where supported.
8. Configure MPU/MMU isolation around privileged components and critical memory.
9. Use sanitizers/emulation builds and fuzz high-risk parsers.
10. Consider Rust or another memory-safe language for new exposed components when toolchain/platform support is mature.
11. Add regression tests for discovered corruption classes.

## Decision points
Static allocation improves predictability but can waste memory; bounded pools can balance determinism and flexibility. Migration to a safe language is strongest for new isolated modules, while mature safety-critical code may require incremental wrappers due to certification/toolchain constraints.

## Common failure patterns
Checking length after copy; signed/unsigned truncation; trusting packet-declared lengths; stack overflow in interrupt context; DMA racing buffer reuse; enabling mitigations only in debug builds; assuming MPU configuration is correct without fault tests.

## Verification
Run static analysis, sanitizer-capable host/emulator tests, fuzzing, boundary tests, stack-usage analysis, and target fault-injection tests for MPU permissions. Confirm release compiler/linker flags actually contain intended protections.

## Expected output
Hardened code/configuration, prioritized findings, regression tests, mitigation evidence, and residual unsafe boundaries.

## Stop conditions
Escalate when fixes alter real-time/safety constraints, toolchain mitigations are unsupported or miscompiled, or a suspected corruption requires destructive production debugging.