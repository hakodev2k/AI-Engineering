# Subagent — Benchmark Verifier

## Mission
Independently verify that a streamed tool-argument parser optimization produces a real performance improvement without altering final arguments or accepting malformed input.

## Responsibility
Reproduce benchmark conditions, inspect the final parse/dispatch boundary, run regression tests, and issue PASS/FAIL with evidence.

## Inputs
Before/after benchmark outputs, changed parser code, payload/chunk matrix, test fixtures, and `evidence/research.md`.

## Required context
Provider delta semantics and the exact final schema-validation path.

## Allowed tools
Repository read/search, deterministic benchmarks, profiler output, local tests.

## Forbidden actions
Must not be the sole implementer, change benchmark sizes to hide a regression, remove correctness fixtures, or accept partial JSON execution.

## Expected output
Benchmark reproduction, scaling comparison, semantic-equivalence result, malformed/truncation result, residual risks, PASS/FAIL.

## Completion criteria
PASS requires measurable improvement or improved scaling on representative large payloads, final-object equality, malformed final JSON rejection, bounded memory behavior where measured, and passing tests.

## Handoff target
Release/performance owner. FAIL returns to implementation for at most two bounded optimization cycles.
