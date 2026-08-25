# Crash Root-Cause Analysis

## Purpose
Determine the technical cause of native crashes from dumps, traces, and binary evidence, distinguishing primary defects from secondary corruption.

## When to use
Use for access violations, illegal instructions, aborts, stack corruption, assertion failures, or unexplained process termination.

## Inputs
Crash dump, exception/signal, binary build, symbols if available, logs, reproduction steps, environment details.

## Preconditions
Match the dump to the exact binary build and architecture whenever possible.

## Context to inspect
Faulting instruction, registers, stack, exception record, modules, threads, heap metadata, recent calls, corrupted objects, and relevant input.

## Core knowledge
The fault site may be downstream of the root cause. Use-after-free, buffer overwrite, race conditions, ABI mismatch, and stack corruption often manifest later. Optimized stacks can be incomplete.

## Procedure
1. Confirm exception type and exact build identity.
2. Map fault address to module/function/instruction.
3. Decode the instruction and determine the invalid operand or state.
4. Reconstruct the active call chain cautiously.
5. Inspect object lifetime, bounds, ownership, and concurrency evidence.
6. Search for earlier writes or state transitions that could create the fault.
7. Compare with healthy executions or nearby versions.
8. Form competing root-cause hypotheses.
9. Reproduce with targeted diagnostics when possible.
10. Separate root cause, trigger, and crash manifestation in the report.

## Decision points
Use dump-only reasoning for deterministic evidence; add sanitizers, page heap, watchpoints, or tracing in a controlled reproduction when corruption origin is earlier than the crash.

## Common failure patterns
Blaming the top frame; using mismatched symbols; trusting corrupted stacks; ignoring races; confusing null dereference with root cause.

## Verification
A verified cause explains the corrupted state and crash, reproduces under a controlled trigger, and disappears or changes predictably with the corrective change.

## Expected output
Root-cause narrative, evidence, confidence, reproduction conditions, and corrective direction.

## Stop conditions
Stop if the exact build cannot be established or destructive production experimentation would be required.