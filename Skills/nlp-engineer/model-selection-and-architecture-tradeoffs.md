# Model Selection and Architecture Trade-offs

## Purpose
Select an NLP model architecture using measured quality, latency, cost, controllability, deployment, licensing, and maintenance trade-offs rather than model popularity.

## When to use
Use when choosing among rules, classical ML, encoder models, seq2seq models, LLMs, hosted APIs, or self-hosted models.

## Inputs
Task definition, baseline results, evaluation suite, traffic forecast, hardware, latency SLO, cost envelope, privacy/security constraints, model licenses.

## Preconditions
A representative benchmark and nonfunctional requirements exist.

## Context to inspect
Input/output lengths, languages, error costs, update frequency, serving infrastructure, vendor constraints, model size, quantization support.

## Core knowledge
Larger models may improve semantic flexibility while increasing latency, cost, nondeterminism, attack surface, and operational complexity. Simpler models frequently win bounded tasks.

## Procedure
1. Establish the simplest credible baseline.
2. Identify quality gaps and whether they require more model capacity.
3. Shortlist architectures that satisfy legal and deployment constraints.
4. Benchmark quality on fixed evaluation data.
5. Measure p50/p95 latency, throughput, memory, and cost.
6. Evaluate controllability, calibration, multilingual behavior, and failure severity.
7. Assess model lifecycle, vendor lock-in, versioning, and rollback.
8. Compare total operating cost, not only per-token or training cost.
9. Select the smallest architecture meeting acceptance gates with adequate margin.
10. Record trade-offs and revisit triggers.

## Decision points
Use rules for stable deterministic patterns; classical/encoder models for bounded classification/extraction; generative models for open semantic tasks; hosted models when operational simplicity outweighs control requirements.

## Common failure patterns
Selecting by benchmark reputation, ignoring p95 latency, comparing models with different prompts/data, undercounting inference cost, and assuming larger always means safer or more accurate.

## Verification
Candidate comparison is reproducible across quality, cost, latency, safety, and operational dimensions.

## Expected output
Decision matrix, benchmark evidence, selected architecture, fallback option, and revisit criteria.

## Stop conditions
Stop when candidate licenses, data handling, or infrastructure constraints are unresolved.