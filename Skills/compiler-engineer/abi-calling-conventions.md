# ABI and Calling Conventions

## Purpose
Implement binary interfaces that interoperate correctly across functions, modules, languages, runtimes, and toolchains.

## When to use
Use for target ports, FFI, argument/return lowering, stack layout, varargs, exception unwinding, or interoperability failures.

## Inputs
Platform ABI, target ISA, runtime contract, type layouts, object format, failing interop case.

## Context to inspect
Register assignments, stack alignment, red zones, callee/caller saves, aggregate classification, varargs, TLS, unwind info, name mangling.

## Core knowledge
ABI is externally observable and compatibility-sensitive. Small mistakes can corrupt state only under optimization or cross-module calls.

## Procedure
1. Identify authoritative ABI specification/version.
2. Map source/IR types to ABI classes.
3. Define argument, return, hidden parameter, and stack rules.
4. Implement prologue/epilogue and preserved-register behavior.
5. Handle aggregates, varargs, tail calls, and special returns.
6. Integrate unwind/debug metadata.
7. Cross-test against an independent compiler/toolchain.
8. Add boundary tests for alignment and register exhaustion.

## Decision points
Follow platform ABI for external linkage; use private conventions only for internal calls when boundaries are controlled and benefits are measured.

## Common failure patterns
Stack misalignment, incorrect aggregate classification, missing extension rules, varargs mismatch, clobbered callee-saved registers, incompatible mangling.

## Verification
Cross-language tests, binary inspection, unwind tests, sanitizers, and ABI conformance suites.

## Expected output
Interoperable, documented lowering with regression coverage.

## Stop conditions
Stop if authoritative ABI requirements or external compatibility target cannot be established.