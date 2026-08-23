# Memory Leaks and Resource Management

## Purpose
Find and eliminate Android memory leaks, excessive retention, and resource-lifetime bugs that cause crashes, degraded performance, or stale UI behavior.

## When to use
Use for OOMs, growing heap, retained activities/fragments, bitmap pressure, repeated navigation leaks, or long-session degradation.

## Inputs
Heap dumps, allocation traces, reproduction steps, lifecycle graph, cache configuration, image/media usage.

## Preconditions
Reproduce on a representative build and distinguish true leaks from temporary high allocation.

## Context to inspect
Activity/Fragment/Compose references, callbacks, listeners, coroutines, handlers, static fields, DI scopes, adapters, caches, bitmaps, streams, cursors, and native resources.

## Core knowledge
Leaks occur when an object outlives its intended owner through a reference chain. Android lifecycle objects are especially vulnerable when captured by long-lived components.

## Procedure
1. Establish a repeatable lifecycle scenario and baseline heap.
2. Trigger creation/destruction cycles several times.
3. Inspect retained objects and reference paths.
4. Identify the lifetime mismatch, not just the retained instance.
5. Remove callbacks/listeners when ownership ends.
6. Cancel or rescope asynchronous work.
7. Avoid retaining Context/View references in long-lived objects.
8. Bound caches and release closeable/native resources.
9. Re-run the same scenario and compare retained heap.
10. Add regression coverage or diagnostics for recurring leak classes.

## Decision points
Use application context only when application lifetime is semantically correct. Cache expensive objects only with explicit size/eviction policy.

## Common failure patterns
Static Activity references, observers never removed, View binding retained after view destruction, unbounded image caches, callback cycles, and long-lived scopes capturing UI objects.

## Verification
Confirm previously retained owners become collectible after lifecycle completion and heap growth stabilizes across repeated cycles.

## Expected output
Root reference chain, ownership fix, before/after memory evidence, and residual risk.

## Stop conditions
Escalate when retention originates in a third-party/native component without a safe workaround or when fixing lifetime requires broad architecture changes.