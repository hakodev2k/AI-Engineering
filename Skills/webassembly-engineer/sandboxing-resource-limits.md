# Sandboxing and Resource Limits

## Purpose
Run untrusted or semi-trusted Wasm workloads with enforceable isolation and resource ceilings.

## When to use
Use for plugins, multi-tenant execution, user-supplied modules, edge functions, or any workload where guest failure must not compromise the host.

## Inputs
Threat model, runtime, host imports, WASI capabilities, tenant model, CPU/memory limits, concurrency limits, and availability objectives.

## Context to inspect
Inspect all imports, filesystem/network exposure, memory maxima, execution interruption, recursion/stack controls, compilation limits, cache sharing, and host callback behavior.

## Core knowledge
Wasm memory safety does not automatically make host integration safe. Imported capabilities define authority. Denial-of-service can target CPU, memory, compilation, host calls, logs, or caches. Isolation requires layered limits.

## Procedure
1. Classify guest trust and tenant boundaries.
2. Enumerate all reachable host capabilities.
3. Remove unnecessary imports and ambient authority.
4. Set memory, execution, input, output, and concurrency limits.
5. Bound compilation and instantiation work.
6. Apply filesystem/network allowlists when exposed.
7. Validate host callback arguments defensively.
8. Define kill/cancel behavior and cleanup.
9. Test adversarial loops, growth, recursion, and host-call abuse.
10. Monitor limit violations separately from application errors.

## Decision points
Use process/container isolation in addition to Wasm when threat or compliance requirements demand defense in depth. Prefer per-tenant instances when state leakage risk outweighs reuse efficiency.

## Common failure patterns
Assuming Wasm alone is a complete sandbox; unlimited host calls; unrestricted WASI; unbounded compilation; shared mutable state across tenants; limits that terminate work but leak resources.

## Verification
Run abuse tests and confirm each limit is enforced, host remains responsive, unauthorized capabilities fail, and resources are reclaimed.

## Expected output
A documented sandbox policy with enforced limits, adversarial tests, and operational signals.

## Stop conditions
Stop if required isolation cannot be enforced by the chosen runtime/deployment architecture or threat assumptions are undefined.