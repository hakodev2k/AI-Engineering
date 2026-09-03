# Context and Token Budgeting

## Purpose
Control multimodal context growth so visual, audio, video, document, and text inputs fit model limits without silently discarding task-critical information.

## When to use
Use when prompts include multiple images, long documents, long audio/video, retrieved context, or expensive high-resolution inputs.

## Inputs
Model context limits, modality tokenization behavior, representative request sizes, latency/cost targets, task priorities.

## Preconditions
Know how each modality consumes context or compute for the selected model and provider.

## Context to inspect
Inspect prompt templates, image resolution, frame counts, document chunks, audio duration, retrieval top-k, conversation history, and output-token reserves.

## Core knowledge
Multimodal context is not fungible. One high-resolution image or dense video clip may consume far more compute than short text. Aggressive truncation can create systematic blind spots. Budgeting should preserve evidence according to task value, not raw arrival order.

## Procedure
1. Measure context consumption by modality.
2. Reserve output capacity and system instructions first.
3. Rank input segments by task relevance.
4. Define per-modality caps and minimum retained evidence.
5. Compress or summarize only after preserving provenance.
6. Use retrieval or hierarchical selection for long media.
7. Detect over-budget requests before inference.
8. Apply deterministic truncation rules.
9. Record what was omitted or compressed.
10. Benchmark quality under increasing compression.
11. Tune budgets against latency and cost.
12. Add alerts when production inputs routinely exceed assumptions.

## Decision points
Prefer retrieval over blind truncation for sparse-relevance inputs. Prefer lower-resolution or fewer frames when visual detail is not required. Use multiple staged model calls when a single context would destroy critical evidence.

## Common failure patterns
Truncating newest or oldest content blindly; failing to reserve output tokens; inconsistent budget logic between evaluation and production; hidden image-token cost; losing provenance after summarization.

## Verification
Test maximum-size requests, compare quality across budget policies, and verify deterministic omission logs. Measure both model quality and cost/latency.

## Expected output
A documented context-allocation policy with deterministic overflow handling, provenance, and benchmark evidence.

## Stop conditions
Stop when required evidence cannot fit within supported context without unacceptable quality loss or cost.