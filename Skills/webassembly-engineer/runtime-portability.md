# Runtime Portability

## Purpose
Keep Wasm artifacts and components portable across an explicitly supported runtime matrix.

## When to use
Use when supporting browsers, server runtimes, edge platforms, embedded hosts, or runtime migrations.

## Inputs
Supported runtimes/versions, required proposals, WASI/component interfaces, performance requirements, and existing portability failures.

## Context to inspect
Inspect enabled features, import namespaces, runtime extensions, WASI versions, limits, compilation modes, floating-point expectations, and host bindings.

## Core knowledge
Core spec conformance does not imply identical embedding APIs, proposal support, resource defaults, WASI coverage, startup performance, or diagnostics. Portability must be tested, not inferred.

## Procedure
1. Define the contractual runtime/version matrix.
2. Define the minimum Wasm feature baseline.
3. Inventory runtime-specific imports/extensions.
4. Isolate unavoidable differences behind adapters.
5. Build artifacts with explicit target features.
6. Validate and instantiate on every runtime.
7. Run semantic and boundary test suites.
8. Compare limits and resource behavior.
9. Measure critical performance on each runtime.
10. Gate runtime upgrades through compatibility tests.

## Decision points
Use lowest common denominator for broad portability; create capability-negotiated variants when advanced features provide material value. Avoid runtime abstraction layers that hide important semantic differences.

## Common failure patterns
“Works on one runtime” portability claims; accidental proprietary imports; assuming WASI preview compatibility; relying on default limits; ignoring feature flags embedded by compiler upgrades.

## Verification
CI executes validation, interface, failure, and representative performance tests across the full supported matrix.

## Expected output
A documented portability contract, adapter boundaries, feature baseline, and automated runtime-matrix evidence.

## Stop conditions
Stop when a required feature has no viable implementation across contractual targets or a runtime divergence affects correctness and cannot be isolated.