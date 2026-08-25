# Runtime Tracing and Instrumentation

## Purpose
Collect targeted execution evidence at scale without manually stepping through every instruction.

## When to use
Use for call tracing, data-flow observation, coverage, API monitoring, performance-sensitive paths, or behavior that is difficult to catch with breakpoints.

## Inputs
Target, isolated environment, trace question, instrumentation framework or OS tracing facilities, symbol/address map.

## Preconditions
Define data-handling constraints because traces can capture credentials, personal data, or proprietary payloads.

## Context to inspect
Process lifecycle, module loads, threads, syscalls/APIs, function boundaries, memory accesses, network/file activity, timestamps, and dropped-event indicators.

## Core knowledge
Instrumentation has overhead and may change timing. Dynamic binary instrumentation, eBPF/ETW/DTrace-like facilities, API hooks, and hardware tracing provide different visibility and trust properties.

## Procedure
1. State the smallest observable needed to answer the question.
2. Select the least intrusive tracing mechanism.
3. Filter by process, module, function, event, or address range.
4. Timestamp and correlate events across threads.
5. Capture arguments or buffers only when necessary and authorized.
6. Detect event loss, recursion, hook reentry, and instrumentation failures.
7. Compare traces across controlled inputs.
8. Feed confirmed paths and signatures back into static analysis.
9. Archive scripts/configuration needed to reproduce the trace.

## Decision points
Prefer OS-native tracing for system interactions, function hooks for semantic boundaries, and instruction tracing only for narrow regions where lower-level detail is required.

## Common failure patterns
Collecting everything; ignoring trace loss; recursive hooks; unsafe buffer reads; interpreting timing under heavy instrumentation as native performance.

## Verification
Run a known control case, verify expected events appear, check loss counters, and reproduce key event sequences.

## Expected output
A bounded, reproducible trace with clear event semantics and conclusions linked to evidence.

## Stop conditions
Stop if instrumentation destabilizes the target, captures prohibited data, or overhead invalidates the behavior being studied.