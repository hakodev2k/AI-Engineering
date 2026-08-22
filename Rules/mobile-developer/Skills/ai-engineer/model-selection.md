# Model Selection

## Purpose
Choose an AI model that meets task quality, latency, cost, safety, context, and operational requirements rather than defaulting to the largest model.

## When to use
Use when starting an AI feature, replacing a model, reducing cost, improving latency, or investigating quality regressions. Do not use benchmark scores alone as the final decision.

## Inputs
Use case, task examples, quality bar, latency SLO, throughput, budget, context size, tool-use needs, modality, privacy and region constraints.

## Preconditions
Define the real user task and measurable acceptance criteria before comparing models.

## Context to inspect
Existing prompts, evaluation set, production traffic shape, provider limits, current failure modes, token usage, safety requirements, fallback behavior.

## Core knowledge
Model quality is workload-specific. Larger models may improve reasoning but usually increase latency and cost. Smaller models can outperform when tasks are narrow, structured, or retrieval-supported. Consider context window, structured output reliability, tool calling, multimodality, rate limits, data policies, version stability, and provider lock-in.

## Procedure
1. Define task categories and critical failure cases.
2. Build a representative evaluation set including difficult and adversarial examples.
3. Shortlist models that satisfy hard constraints.
4. Run identical prompts and settings across candidates.
5. Measure task success, hallucination/error rate, latency distribution, token usage, and cost.
6. Test tool calling and structured outputs when applicable.
7. Evaluate safety and refusal behavior on risky inputs.
8. Test concurrency and provider limits under realistic load.
9. Compare total system cost, not token price alone.
10. Select the smallest model that reliably meets the quality bar, with a documented escalation/fallback strategy when useful.

## Decision points
Prefer a smaller model for deterministic extraction, classification, routing, and low-risk transformations when evaluations pass. Prefer stronger models for ambiguous reasoning, complex planning, or high-cost errors. Consider model cascades when most requests are simple but a minority need deeper reasoning.

## Common failure patterns
Choosing by leaderboard score, testing only happy paths, ignoring p95 latency, comparing models with different prompts, overlooking regional/privacy constraints, and assuming a provider model alias is immutable.

## Verification
Run the agreed evaluation suite, load test critical paths, validate cost projections with real token distributions, and record the selected model/version and fallback behavior.

## Expected output
A model decision with evidence, thresholds, known limitations, and rollback criteria.

## Stop conditions
Stop when acceptance criteria are undefined, production data cannot be used safely, provider terms are unclear, or evidence is insufficient to make a defensible comparison.