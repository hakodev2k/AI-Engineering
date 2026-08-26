# Fuzzing Wasm Boundaries

## Purpose
Use coverage-guided and structured fuzzing to discover validation, parser, ABI, memory, and host-integration defects before production.

## When to use
Use for parsers, untrusted modules, binary transforms, host imports, serialization layers, and security-sensitive interfaces.

## Inputs
Fuzz target, trust boundary, corpus, runtime/toolchain, invariants, resource budgets, and crash triage workflow.

## Context to inspect
Inspect input parsers, pointer/length decoding, generated bindings, host callbacks, binary validators, timeout controls, and existing regression corpus.

## Core knowledge
Fuzzing is effective when targets are deterministic, bounded, and assert meaningful invariants. Wasm testing can fuzz module bytes, structured interface values, or guest inputs. Crashes must be minimized and classified across guest/runtime/host layers.

## Procedure
1. Choose a narrow security/correctness boundary.
2. Define invariants beyond “does not crash.”
3. Seed with valid and edge-case corpus entries.
4. Bound memory, execution time, and output.
5. Instrument coverage where supported.
6. Run long enough to explore meaningful states.
7. Minimize each failure.
8. Reproduce outside the fuzzer.
9. Classify guest bug, host bug, runtime bug, or expected trap.
10. Add fixed cases permanently to regression tests.

## Decision points
Use structured generators for typed interfaces; raw-byte mutation for binary/parser robustness. Differential fuzz multiple runtimes when spec conformance is under question.

## Common failure patterns
Treating every trap as vulnerability; unbounded hangs; nondeterministic targets; corpus without valid seeds; fixing crash without preserving minimized regression input.

## Verification
Re-run minimized cases on fixed builds, confirm fuzz target remains bounded, and track coverage/crash uniqueness over time.

## Expected output
A reusable fuzz harness, minimized regression corpus, and classified findings with verified fixes.

## Stop conditions
Stop a campaign if it can affect production resources, secrets, or external systems, or if a suspected runtime vulnerability requires coordinated security handling.