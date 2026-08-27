# Tracing Hook Selection

## Purpose
Choose stable, sufficiently expressive eBPF tracing hooks with minimum operational risk.

## When to use
Use before implementing kernel/application tracing or when existing probes break across kernels.

## Inputs
Signal requirements, target kernels, process scope, function/argument needs, stability and overhead constraints.

## Context to inspect
Inspect tracepoints, raw tracepoints, fentry/fexit, kprobes/kretprobes, uprobes/uretprobes, USDT, BTF, symbol availability, and attach permissions.

## Core knowledge
Hook stability and semantic fidelity differ. Tracepoints expose intentional ABI-like events; fentry/fexit are efficient with BTF; kprobes are flexible but tied to implementation details; uprobes depend on user binary layout.

## Procedure
1. Define the exact event and fields required.
2. Search stable tracepoints/USDT first.
3. Evaluate fentry/fexit where BTF and function visibility allow.
4. Use kprobes/uprobes only when more stable hooks cannot answer the question.
5. Check inlining, symbols, argument conventions, and target variants.
6. Measure event frequency and expected overhead.
7. Add attach capability checks and fallbacks.
8. Validate semantic equivalence across targets.

## Decision points
Prefer the most stable hook that preserves required semantics, not necessarily the newest hook. Use multiple fallback implementations only when support value exceeds maintenance cost.

## Common failure patterns
Probing unstable internals, assuming symbols exist, ignoring inlining, incorrect user ABI decoding, and high-frequency hooks without filtering.

## Verification
Test attachment and decoded semantics across representative kernels/binaries; compare against an independent ground truth.

## Expected output
A documented hook choice, fallback chain, and stability rationale.

## Stop conditions
Stop if no hook exposes required semantics safely or attach permissions cannot be granted.