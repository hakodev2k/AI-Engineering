# JavaScript Runtime Integration

## Purpose
Integrate the JavaScript engine with browser objects, event loops, garbage collection, exceptions, and execution policy safely and efficiently.

## When to use
Use for bindings, script execution, event-loop bugs, memory leaks, runtime embedding, or execution-policy changes.

## Inputs
Binding code, runtime traces, heap data, task scheduling logs, web-facing contract.

## Context to inspect
Execution contexts, realms, wrappers, GC roots, microtasks, tasks, exceptions, teardown, script policy.

## Core knowledge
Browser objects and JS objects often have different lifetime systems. Tasks and microtasks have ordering guarantees. Execution contexts can disappear asynchronously. Cross-realm values require careful identity and security handling.

## Procedure
1. Identify the owning execution context and realm.
2. Trace native-to-JS and JS-to-native references.
3. Verify GC rooting and teardown behavior.
4. Map task and microtask ordering.
5. Propagate exceptions according to API semantics.
6. Check context destruction between asynchronous steps.
7. Measure allocation and callback overhead.
8. Add tests for GC, navigation teardown, exceptions, and ordering.

## Decision points
Use weak references only when observable semantics tolerate collection. Queue microtasks only for specified microtask semantics; otherwise use the appropriate task source.

## Common failure patterns
Dangling native wrappers; leaked roots; callbacks after context destruction; swallowed exceptions; incorrect microtask ordering; cross-realm identity assumptions.

## Verification
Run binding tests, forced-GC tests, lifecycle tests, conformance tests, and heap/leak analysis.

## Expected output
Correct runtime integration with explicit lifetime and scheduling behavior.

## Stop conditions
Escalate when language semantics or web-standard requirements are uncertain or when runtime invariants would need to be bypassed.