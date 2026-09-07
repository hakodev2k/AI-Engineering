# GPU Architecture Portability and Dispatch

## Purpose
Preserve high performance across multiple GPU architectures and programming backends by isolating architecture-sensitive assumptions, selecting safe specializations, and maintaining robust fallback paths.

## When to use
Use when a kernel must support multiple GPU generations, vendors, compute capabilities, wave/warp widths, matrix-unit modes, or compiler backends without silently regressing correctness or performance.

## Inputs
Supported device matrix, compiler/runtime backends, kernel variants, architecture capability data, benchmark suite, numerical requirements, deployment constraints.

## Preconditions
Define the minimum supported feature set and performance expectations per device class. Do not assume identical warp/subgroup width, cache behavior, shared-memory capacity, or specialized instruction support.

## Context to inspect
Inspect subgroup width assumptions, maximum workgroup size, shared memory, register file, cache line/transaction behavior, matrix/tensor units, asynchronous copy support, atomic capabilities, compiler feature macros, binary compatibility, and runtime dispatch logic.

## Core knowledge
Portable source does not guarantee portable performance. Senior optimization separates algorithm invariants from hardware-specific scheduling choices. Specialization should be justified by measurable benefit and bounded maintenance cost, with a correct generic path as the safety net.

## Procedure
1. Inventory all hardware-sensitive assumptions in the kernel and build system.
2. Classify each assumption as required for correctness, performance only, or optional acceleration.
3. Implement a correct baseline using the common supported feature set.
4. Add specialization only for architectures where measurement shows material benefit.
5. Dispatch using explicit, testable capability checks rather than device-name heuristics when possible.
6. Keep numerical semantics consistent across variants unless differences are documented and accepted.
7. Benchmark representative shapes on each supported architecture family.
8. Test unsupported or unknown devices through the generic fallback.
9. Record compiler and driver constraints for each specialized path.
10. Revalidate variants after toolchain or hardware-matrix changes.

## Decision points
Use one generic kernel when specialization gains are marginal. Maintain separate tuned variants when architecture differences materially affect tile size, matrix instructions, subgroup behavior, or memory pipelines. Prefer capability-based dispatch over brittle generation lists.

## Common failure patterns
Hard-coding warp width; selecting by marketing model name; assuming shared-memory limits are uniform; shipping an untested fallback; allowing optimized variants to diverge semantically; accumulating specializations with no regression coverage.

## Verification
Run correctness and performance suites on every supported architecture class, force each dispatch path in tests, verify unknown-device fallback, and compare numerical behavior across variants.

## Expected output
A capability-driven portability strategy with bounded specialization, documented assumptions, and architecture-specific benchmark evidence.

## Stop conditions
Escalate when required performance depends on mutually incompatible vendor features, the support matrix is undefined, or maintaining specialized variants exceeds the agreed engineering budget.