# Browser Integration

## Purpose
Integrate Wasm into web applications with correct loading, JavaScript boundaries, caching, security headers, and user-perceived performance.

## When to use
Use for browser-hosted Wasm modules, workers, streaming instantiation, or JS/Wasm interop.

## Inputs
Web architecture, browser support matrix, module artifact, JS/TS bindings, hosting/CDN config, CSP/COOP/COEP requirements, and performance targets.

## Context to inspect
Inspect MIME type, fetch/caching headers, instantiation path, imports, worker usage, SharedArrayBuffer requirements, bundler behavior, source maps, and fallback strategy.

## Core knowledge
Streaming compilation depends on correct serving behavior. JS/Wasm crossings and copying can dominate fine-grained calls. Threads/shared memory require browser isolation headers. Browser engines differ in optimization and diagnostics.

## Procedure
1. Define supported browsers and feature baseline.
2. Serve `.wasm` with correct content type and immutable/versioned caching.
3. Choose streaming or buffered instantiation intentionally.
4. Minimize and batch JS/Wasm boundary calls.
5. Move CPU-heavy work to workers when UI responsiveness requires it.
6. Configure isolation headers for shared memory only when needed.
7. Handle load/compile/instantiate failures visibly.
8. Preserve source maps/symbolication workflow.
9. Measure cold load, compile, memory, and interaction latency.
10. Test real browsers and constrained devices.

## Decision points
Use main thread only for short bounded work; workers for sustained CPU tasks. Prefer transferable/canonical representations before introducing shared-memory complexity.

## Common failure patterns
Wrong MIME type; cache-busting every request; synchronous UI blocking; excessive tiny interop calls; enabling threads without required headers; assuming desktop performance represents mobile.

## Verification
Run cross-browser E2E tests, network throttling, cache validation, performance traces, and failure-path tests.

## Expected output
A responsive, cache-efficient, cross-browser integration with measured startup and interop behavior.

## Stop conditions
Stop if required browser features are outside support policy or security headers conflict with third-party integration requirements requiring architectural approval.