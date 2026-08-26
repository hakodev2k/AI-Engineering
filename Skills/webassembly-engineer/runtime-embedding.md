# Runtime Embedding

## Purpose
Embed a WebAssembly runtime into a host application with controlled lifecycle, resources, capabilities, and error handling.

## When to use
Use when applications execute Wasm plugins, policies, functions, extensions, or sandboxed business logic.

## Inputs
Host language, runtime SDK, module interface, concurrency model, resource budgets, trust model, and deployment constraints.

## Context to inspect
Inspect engine/store/context lifecycle, compilation cache, linker/import registration, WASI setup, memory limits, interruption/fuel mechanisms, threading guarantees, and error mapping.

## Core knowledge
Runtime engines often separate compiled code from per-instance state. Stores/contexts may not be freely shared across threads. Host callbacks cross trust and failure boundaries. Resource control must include CPU/time, memory, and external capabilities.

## Procedure
1. Define guest lifecycle and isolation unit.
2. Configure engine features explicitly.
3. Compile/cache modules at the appropriate scope.
4. Register narrowly scoped host imports.
5. Instantiate per required state-isolation model.
6. Enforce memory and execution budgets.
7. Map traps and host errors without losing diagnostics.
8. Make cancellation/interruption behavior deterministic.
9. Test concurrent invocation and teardown.
10. Instrument compile, instantiate, execute, and host-call latency.

## Decision points
Reuse compiled artifacts broadly; reuse instances only when state semantics allow it. Choose fuel/epoch/timeouts according to runtime support and determinism needs.

## Common failure patterns
Sharing non-thread-safe stores; no execution deadline; broad host callbacks; compiling on every request; swallowing traps; leaking instances/resources after host exceptions.

## Verification
Stress concurrency, cancellation, malformed modules, resource exhaustion, and host callback failures. Confirm metrics and cleanup.

## Expected output
A bounded, observable embedding layer with explicit lifecycle and capability rules.

## Stop conditions
Stop if the runtime cannot enforce required isolation/budgets or host callbacks require privileges outside approved policy.