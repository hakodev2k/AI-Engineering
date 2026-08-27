# Embedded C and C++ Firmware

## Purpose
Produce deterministic, maintainable firmware using C/C++ while respecting hardware and toolchain constraints.

## When to use
Use for drivers, board support, control logic, or review of embedded code. Do not apply hosted-runtime assumptions without checking the target.

## Inputs
Repository, MCU/SoC, compiler, language standard, linker configuration, timing and memory constraints.

## Context to inspect
Build flags, startup code, HAL/BSP, memory map, coding standard, generated code boundaries, warnings and static-analysis configuration.

## Core knowledge
Understand object lifetime, volatile semantics, integer widths, undefined behavior, alignment, strict aliasing, templates where justified, exceptions/RTTI cost, ABI and optimization effects.

## Procedure
1. Confirm target, compiler and standards.
2. Map hardware-facing and portable layers.
3. Identify lifetime, ownership and concurrency boundaries.
4. Use fixed-width types at interfaces.
5. Minimize dynamic allocation in deterministic paths.
6. Make hardware access explicit.
7. Enable strong warnings and static analysis.
8. Build all supported configurations.
9. Test boundary and fault cases on target.

## Decision points
Choose C for minimal ABI/toolchain surfaces; C++ for stronger type/lifetime abstractions when runtime costs are controlled. Prefer compile-time abstraction over runtime polymorphism in constrained hot paths.

## Common failure patterns
Undefined behavior hidden by optimization, accidental heap use, unsafe casts, signed overflow, incorrect volatile use, static initialization order, ignored warnings.

## Verification
Require clean builds, static-analysis review, map-file inspection where relevant, target tests and measured timing/memory evidence.

## Expected output
A portable, analyzable implementation with explicit hardware and resource assumptions.

## Stop conditions
Escalate when compiler behavior, silicon errata, ABI constraints or safety requirements cannot be established.