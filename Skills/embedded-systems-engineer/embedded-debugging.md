# Embedded Debugging

## Purpose
Investigate firmware defects systematically using debuggers, traces, registers, memory evidence, and hardware instruments without relying on guesswork.

## When to use
Use for crashes, hangs, corrupt state, peripheral failures, timing issues, boot problems, and intermittent field defects.

## Inputs
Reproduction steps, binary/ELF, symbols, logs, crash dump, board, debugger, schematics, traces, and recent changes.

## Context to inspect
Inspect reset cause, PC/LR/SP, fault status registers, call stack, task state, memory corruption indicators, peripheral registers, clocks, pins, and optimized build differences.

## Core knowledge
Debuggers can perturb timing and power. Optimize evidence collection before changing code. Fault registers, watchpoints, trace, logic analyzers, and map files often provide stronger evidence than added prints.

## Procedure
1. Define the observed failure and expected behavior precisely.
2. Preserve the failing binary/configuration.
3. Classify reset, exception, deadlock, timing, or hardware symptom.
4. Capture minimal high-value state before modifying code.
5. Form hypotheses tied to evidence.
6. Use breakpoints/watchpoints/trace/instruments selectively.
7. Reduce to the smallest reproducible path.
8. Validate the root cause by forcing/removing the suspected condition.
9. Add regression detection.

## Decision points
Use live debugging for reproducible lab issues; persistent crash telemetry for field/intermittent issues; hardware instruments when signal/timing behavior is uncertain.

## Common failure patterns
Adding delays until the bug disappears, trusting corrupted stacks blindly, debugging a different build, clearing fault registers before capture, and changing multiple variables simultaneously.

## Verification
Reproduce before fix, demonstrate causal evidence, apply the fix, rerun stress/fault scenarios, and confirm no timing regression.

## Expected output
A root-cause record with evidence, fix, regression test, and any remaining uncertainty.

## Stop conditions
Stop when the exact firmware/hardware revision cannot be identified or debugging risks destructive/safety-sensitive operation without controls.