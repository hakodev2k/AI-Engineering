# Host–Guest Interface Design

## Purpose
Design stable, explicit boundaries between WebAssembly components and their host environment.

## When to use
Use when defining imports/exports, embedding Wasm, exposing host services, or evolving a guest API. Avoid ad-hoc ABI design when a standard component interface already fits.

## Inputs
Use cases, data shapes, latency constraints, language/toolchain targets, compatibility requirements, trust boundary, and host capabilities.

## Context to inspect
Inspect current imports/exports, canonical data representations, ownership rules, error model, runtime embedding API, generated bindings, and versioning policy.

## Core knowledge
A Wasm boundary is an ABI and often a security boundary. Primitive core-Wasm signatures do not directly express rich application types. Crossing costs include serialization, copying, allocation, and host transitions. Component Model/WIT can provide typed interfaces and language bindings where supported.

## Procedure
1. Define business capabilities rather than leaking host implementation details.
2. Identify stable operations and data contracts.
3. Choose core ABI or typed component interface based on ecosystem support.
4. Define ownership, allocation, encoding, and lifetime rules.
5. Define errors explicitly and avoid ambiguous sentinel values.
6. Minimize chatty boundary crossings.
7. Version contracts and document compatibility guarantees.
8. Apply least privilege to imported host capabilities.
9. Generate or test bindings for every supported language.
10. Add contract, malformed-input, and compatibility tests.

## Decision points
Prefer WIT/Component Model for rich portable interfaces when toolchains support it; prefer a minimal core ABI for constrained or legacy environments. Copy data for isolation and simplicity; share memory only when measured performance justifies added coupling.

## Common failure patterns
Passing raw host pointers; undocumented allocator ownership; UTF encoding disagreement; oversized chatty APIs; implicit error conventions; breaking export signatures silently; exposing broad host capability objects.

## Verification
Run contract tests from each supported host/guest language, fuzz boundary decoding, measure crossing overhead, and verify backward compatibility.

## Expected output
A versioned, documented, least-privilege interface with generated or tested bindings and explicit ownership/error semantics.

## Stop conditions
Stop when ownership semantics are unresolved, compatibility requirements conflict, or the interface would expose capabilities not approved for the guest.