# Memory and Lifetime Debugging

## Purpose
Find leaks, use-after-free risks, excessive retention, and lifetime races in long-running multi-process browser workloads.

## When to use
Use for memory growth, OOM, renderer bloat, suspected leaks, lifecycle crashes, or ownership refactors.

## Inputs
Heap profiles, allocation traces, crash dumps, reproduction scenario, object graph, lifecycle code.

## Context to inspect
Ownership conventions, reference cycles, observers, callbacks, caches, GC/native boundaries, process memory accounting.

## Core knowledge
Browser memory combines managed heaps, native allocations, graphics resources, caches, shared memory, and process overhead. Retention and fragmentation can differ from leaks. Asynchronous destruction makes lifetime bugs subtle.

## Procedure
1. Establish a repeatable workload and baseline.
2. Separate per-process and allocation-domain growth.
3. Compare heap snapshots across lifecycle checkpoints.
4. Find retaining paths or unbalanced ownership.
5. Inspect observers, timers, callbacks, caches, and cross-language wrappers.
6. Check destruction ordering and weak-reference assumptions.
7. Fix ownership rather than merely forcing cleanup.
8. Repeat long-duration and navigation cycles.

## Decision points
Use strong ownership for required lifetime, weak observation for non-owning relationships, and bounded caches for recomputable data.

## Common failure patterns
Reference cycles; forgotten observers; callbacks retaining contexts; unbounded caches; mislabeling fragmentation as leak; fixing symptoms with periodic purge.

## Verification
Memory reaches a stable envelope, leak detectors are clean, lifecycle tests pass, and no new crashes appear under stress.

## Expected output
A root-cause-backed lifetime fix with quantitative memory evidence.

## Stop conditions
Stop when required diagnostic instrumentation is unavailable or the suspected issue crosses an unsafe ownership boundary needing subsystem review.