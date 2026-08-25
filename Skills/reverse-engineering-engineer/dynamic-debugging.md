# Dynamic Debugging

## Purpose
Observe runtime state and control flow safely to validate static hypotheses, resolve dynamic behavior, and reproduce faults.

## When to use
Use when behavior depends on runtime values, indirect calls, generated code, environment state, or when static evidence is ambiguous.

## Inputs
Authorized target, isolated environment, debugger, symbols if available, reproducible inputs, static hypotheses.

## Preconditions
Snapshot or otherwise make the environment recoverable. Never debug untrusted code on sensitive infrastructure.

## Context to inspect
Process/module maps, threads, registers, stack, heap, loaded libraries, exceptions/signals, breakpoints, environment, filesystem/network side effects.

## Core knowledge
Debuggers perturb timing and can alter anti-debug behavior. Software breakpoints modify code; hardware breakpoints are scarce. ASLR and JIT code require runtime address mapping.

## Procedure
1. Define the hypothesis or question before execution.
2. Start from a clean isolated state and record inputs.
3. Map modules and runtime addresses to static analysis.
4. Place minimal breakpoints at high-value transitions.
5. Observe arguments, return values, memory mutations, and branch conditions.
6. Use watchpoints for unexplained data changes.
7. Step only where necessary; prefer strategic run-to points.
8. Capture traces and state needed to reproduce conclusions.
9. Reset the environment before testing alternate hypotheses.

## Decision points
Use breakpoints for focused questions, tracing for path discovery, and watchpoints for mutation provenance. Prefer non-invasive instrumentation when anti-debug or timing sensitivity is suspected.

## Common failure patterns
Breakpoint overload; changing state without documenting it; mistaking debugger-induced behavior for native behavior; ignoring multithreading; mapping wrong module bases.

## Verification
Repeat observations from a clean state and correlate runtime addresses and values with static code. Confirm key behavior with at least one alternate input or observation method.

## Expected output
A reproducible runtime evidence record that confirms or rejects specific hypotheses.

## Stop conditions
Stop if execution escapes containment, requires unauthorized access, produces destructive side effects, or cannot be reproduced reliably.