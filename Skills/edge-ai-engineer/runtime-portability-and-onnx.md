# Runtime Portability and ONNX

## Purpose
Move models reliably from training frameworks into edge inference runtimes while controlling operator compatibility, numerical differences, graph transformations, and hardware-specific execution.

## When to use
Use when exporting models, supporting multiple device families, changing inference runtimes, or diagnosing discrepancies between training and deployed inference.

## Inputs
Source model, export code, representative inputs, target runtimes, operator support matrices, target hardware, and numerical tolerance requirements.

## Preconditions
The source model must have a deterministic evaluation mode and a validated preprocessing contract.

## Context to inspect
Opset versions, custom operators, dynamic shapes, graph optimizations, tensor layouts, precision conversions, runtime execution providers, and fallback paths.

## Core knowledge
Portable graph formats reduce framework coupling but do not guarantee identical semantics. Export may rewrite operations, freeze behavior, change padding or interpolation semantics, and expose unsupported dynamic control flow. Runtime portability requires artifact-level conformance tests.

## Procedure
1. Freeze the source model in inference mode and capture golden inputs/outputs.
2. Define required input shapes, dtypes, layouts, and dynamic dimensions.
3. Select an opset supported across intended runtimes.
4. Export with minimal custom operators.
5. Run structural validation and inspect the exported graph.
6. Compare outputs against the source model over representative and edge-case inputs.
7. Identify operator fallback or unsupported execution-provider placement.
8. Benchmark each target runtime on real devices.
9. Lock model, exporter, runtime, and conversion-tool versions.
10. Add compatibility tests to the release pipeline.
11. Record known numerical tolerances and unsupported configurations.

## Decision points
Prefer standard operators and static shapes for broad portability. Accept runtime-specific graph variants when measurable hardware gains justify additional artifact and testing complexity.

## Common failure patterns
Assuming export success means semantic equivalence, hidden CPU fallback, opset drift, dynamic-shape paths never tested, tensor-layout mismatch, and runtime upgrades changing graph optimization behavior.

## Verification
Run golden-vector conformance tests, inspect operator placement, benchmark device latency and memory, and verify artifacts across every supported runtime/hardware combination.

## Expected output
A portable, versioned inference artifact and compatibility contract with tested numerical and runtime behavior.

## Stop conditions
Stop when required model semantics cannot be represented faithfully, critical operators lack supported implementations, or output differences exceed approved tolerance.