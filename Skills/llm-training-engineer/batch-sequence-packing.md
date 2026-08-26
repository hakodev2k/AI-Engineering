# Batch Construction and Sequence Packing

## Purpose
Maximize useful tokens per accelerator step while preserving correct sample boundaries, masks, and objective semantics.

## When to use
Use when training throughput is limited by padding, variable-length data, or batch construction inefficiency.

## Inputs
Tokenized samples, length distribution, context length, global batch target, attention implementation, objective, distributed sampler.

## Context to inspect
Padding fraction, packing rules, document boundaries, EOS handling, attention/loss masks, sampler determinism, and per-rank token counts.

## Core knowledge
Packing improves utilization but can accidentally allow cross-document attention or loss leakage. Batch size should be reasoned about in tokens as well as sequences. Length distributions affect memory and step-time variance.

## Procedure
1. Measure sequence-length distribution and padding waste.
2. Define boundary and EOS semantics.
3. Implement deterministic packing or bucketing.
4. Verify attention and loss masks on synthetic examples.
5. Confirm each source token is counted exactly as intended.
6. Measure per-rank token balance and stragglers.
7. Recalculate global tokens per optimizer update.
8. Benchmark throughput and memory before/after.
9. Test resume determinism around sampler state.

## Decision points
Use packing when padding waste is material and boundary semantics are correct. Use length bucketing when packing complexity is unnecessary. Prefer fixed token budgets when sequence counts produce unstable effective batch size.

## Common failure patterns
Cross-document leakage; duplicated/dropped samples; hidden batch-size change; imbalance across ranks; non-reproducible sampler state after resume.

## Verification
Unit tests prove mask semantics, corpus accounting matches expected tokens, distributed ranks remain balanced, and measured useful-token throughput improves.

## Expected output
A reproducible batching/packing policy with correctness tests and utilization metrics.

## Stop conditions
Stop if token accounting cannot be reconciled, masking is ambiguous, or resume changes sample order unexpectedly.