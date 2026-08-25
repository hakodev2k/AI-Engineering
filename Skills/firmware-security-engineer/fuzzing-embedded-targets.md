# Fuzzing Embedded Targets

## Purpose
Apply coverage-guided and structure-aware fuzzing to firmware parsers, protocols, drivers, and state machines despite target speed and observability constraints.

## When to use
Use for externally reachable parsers, update formats, IPC/syscalls, command handlers, or regression after memory-safety/security defects.

## Inputs
Source or binary harness points, protocol seeds, build system, host/emulator capability, sanitizers, target hardware, crash telemetry, and resource limits.

## Preconditions
Choose a deterministic, side-effect-controlled test boundary. Never fuzz production systems or hardware where unsafe actuation can occur.

## Context to inspect
Input parsing boundaries, hardware abstraction layers, global state, timing/randomness, watchdogs, persistent writes, interrupts, and crash/fault handlers.

## Core knowledge
Fast host-native fuzzing usually finds more bugs than direct target fuzzing; target replay validates architecture-specific behavior. Harness fidelity matters. Sanitizers amplify detection. Stateful protocols need sequence-aware harnesses, not only random packets.

## Procedure
1. Prioritize attack-surface components by exposure and privilege.
2. Extract or adapt a pure parser/handler boundary for host execution.
3. Stub hardware with behaviorally faithful bounded models.
4. Enable ASan/UBSan or equivalent instrumentation where possible.
5. Seed with valid minimal and representative corpus inputs.
6. Add dictionaries or grammar structure for checksums, tags, and field names.
7. Remove nondeterminism and reset global state between cases.
8. Run coverage-guided fuzzing and track unique crashes/hangs.
9. Minimize crashing inputs and perform root-cause analysis.
10. Convert confirmed defects into regression tests.
11. Replay cases on emulator and target hardware.
12. Add target-specific fault telemetry for issues not visible on host.

## Decision points
Use host fuzzing for throughput, emulation for architectural fidelity, and hardware-in-loop for peripherals/timing. Grammar-aware fuzzing is worthwhile when random mutation cannot pass deep structural validation.

## Common failure patterns
Fuzzing only happy-path API wrappers; harness rejecting inputs before real parser; crashes caused by unrealistic stubs; no state reset; counting duplicate crashes; never replaying on target; ignoring hangs/watchdog resets.

## Verification
Demonstrate meaningful code/state coverage, stable reproduction of findings, sanitizer-clean regression corpus, and target replay for security-relevant cases. Track time-to-crash and corpus growth to detect stalled harnesses.

## Expected output
Reusable harnesses, seed/dictionary corpus, triaged defects, regression tests, coverage evidence, and target replay results.

## Stop conditions
Stop a campaign when the harness is demonstrably unrealistic, unsafe hardware effects cannot be isolated, or a crash requires privileged production data to reproduce; redesign or escalate first.