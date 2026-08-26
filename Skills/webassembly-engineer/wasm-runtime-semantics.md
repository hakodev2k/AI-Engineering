# WebAssembly Runtime Semantics

## Purpose
Apply WebAssembly (Wasm) execution semantics correctly when designing, debugging, or reviewing portable modules and hosts.

## When to use
Use for runtime behavior, traps, validation, memory/table/global semantics, feature compatibility, or unexplained cross-runtime differences. Do not use as a substitute for application-domain requirements.

## Inputs
Module source or binary, target runtimes, enabled proposals/features, host configuration, failing inputs, logs, and tests.

## Context to inspect
Inspect module format, imports/exports, value types, memories, tables, globals, start function, runtime versions, feature flags, and embedding API before changing code.

## Core knowledge
Validation is distinct from instantiation and execution. Traps are runtime failures, not language exceptions unless an exception-handling feature is deliberately used. Wasm has explicit numeric, memory, control-flow, and reference semantics; hosts add capabilities through imports. Feature proposals may have uneven runtime support.

## Procedure
1. Reproduce on the exact runtime and feature set.
2. Validate the module independently.
3. Enumerate imports, exports, memories, tables, and globals.
4. Identify the instruction or boundary where behavior diverges.
5. Check numeric conversion, bounds, alignment, growth, and trap semantics.
6. Compare behavior against a second conforming runtime when portability is expected.
7. Reduce the failure to a minimal module.
8. Fix the semantic mismatch rather than masking the trap.
9. Add regression tests across supported runtimes.

## Decision points
Prefer stable core features for broad portability; use newer proposals only when their benefit exceeds compatibility cost. Decide whether a failure belongs in guest logic, host adaptation, or an explicit compatibility layer.

## Common failure patterns
Assuming host-language semantics apply inside Wasm; confusing validation errors with traps; relying on proposal features without negotiation; ignoring memory growth invalidation; accidental signed/unsigned interpretation.

## Verification
Verify validation, instantiation, deterministic test behavior, expected traps, and cross-runtime compatibility for the declared support matrix.

## Expected output
A semantically correct module/host interaction plus evidence explaining the root cause and supported runtime assumptions.

## Stop conditions
Stop if the required runtime feature is unavailable, the binary is untrusted and requires security review, or evidence shows a runtime implementation defect needing upstream escalation.