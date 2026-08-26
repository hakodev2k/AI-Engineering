# Component Model and WIT

## Purpose
Design composable WebAssembly components with typed interfaces using the Component Model and WebAssembly Interface Types (WIT).

## When to use
Use for multi-language component composition, reusable plugins, typed host bindings, or interface evolution. Do not adopt it solely for novelty when deployment runtimes lack required support.

## Inputs
Domain operations, type model, supported languages/toolchains, runtime matrix, versioning expectations, and existing core-Wasm modules.

## Context to inspect
Inspect current WIT packages/worlds, generated bindings, adapters, component metadata, runtime feature support, dependency graph, and release policy.

## Core knowledge
WIT models interfaces, worlds, resources, records, variants, results, and other language-neutral types. Components lift/lower values through the canonical ABI. Composition reduces bespoke glue but introduces toolchain/version compatibility concerns.

## Procedure
1. Model capabilities as cohesive WIT interfaces.
2. Separate imported from exported responsibilities.
3. Prefer domain types over encoded strings or byte blobs.
4. Model failures with typed results/variants.
5. Use resources only when identity/lifetime semantics require them.
6. Generate bindings for target languages and inspect ownership semantics.
7. Componentize legacy modules with adapters where appropriate.
8. Compose dependencies and validate worlds.
9. Test interface compatibility and resource cleanup.
10. Pin and document toolchain/runtime requirements.

## Decision points
Use value types for immutable transferable data; resources for stateful identity. Split interfaces when consumers need different capability sets. Preserve a core-Wasm ABI when ecosystem compatibility outweighs typed composition benefits.

## Common failure patterns
Creating giant worlds; encoding structured data as JSON unnecessarily; leaking language-specific concepts; ignoring resource lifetime; assuming generated bindings remove all compatibility concerns.

## Verification
Build and instantiate components on supported runtimes, exercise generated bindings from each language, test error/resource paths, and validate composition after dependency upgrades.

## Expected output
Versioned WIT packages, composable components, verified bindings, and explicit runtime/toolchain compatibility.

## Stop conditions
Stop if required Component Model features are unsupported in production or interface ownership/versioning cannot be made stable.