# Evaluation Strategy

## Purpose
Design an evaluation program that connects AI system quality to product risk, user outcomes, and release decisions. This skill prevents teams from optimizing isolated metrics that do not represent real behavior.

## When to use
Use when launching a model, agent, RAG system, prompt change, fine-tune, or major workflow revision; when existing evaluations disagree with production outcomes; or when teams need release gates.

## Inputs
- Product requirements and critical user journeys
- System architecture and model dependencies
- Known failure modes and incident history
- Risk tolerance and release process
- Available datasets, logs, and reviewers

## Preconditions
The system goal and intended users must be sufficiently defined to identify what success and unacceptable failure mean.

## Context to inspect
Inspect prompts, model versions, tool calls, retrieval layers, safety controls, production telemetry, user feedback, and existing tests before proposing metrics.

## Core knowledge
Evaluation must combine task quality, reliability, safety, latency, cost, and operational risk. Offline metrics are proxies; production outcomes are the final reference. Senior evaluation work distinguishes deterministic checks, statistical benchmarks, human judgment, adversarial testing, and online experiments.

## Procedure
1. Define the evaluated system boundary and release decision the evaluation must support.
2. Identify critical user journeys and high-impact failure modes.
3. Partition quality into measurable dimensions rather than one aggregate score.
4. Assign each dimension an evaluation method: deterministic, model-based, human, adversarial, or online.
5. Build representative slices for common, rare, and high-risk cases.
6. Define baselines, target thresholds, and unacceptable regressions.
7. Specify confidence requirements and minimum sample sizes.
8. Define how metrics roll into release gates without hiding slice-level failures.
9. Establish evaluation cadence for development, pre-release, and production monitoring.
10. Document limitations and known blind spots.

## Decision points
Use strict hard gates for safety, contractual correctness, or catastrophic failures. Use statistical gates for noisy quality metrics. Prefer slice-specific thresholds when aggregate averages can mask harm or regressions.

## Common failure patterns
- Optimizing a single benchmark score
- Building only easy or synthetic cases
- Treating judge-model scores as ground truth
- Ignoring latency and cost
- Letting averages hide critical cohorts
- Changing datasets and thresholds simultaneously

## Verification
Verify that every critical failure mode has at least one corresponding evaluation, thresholds map to an explicit release decision, and a known bad system version is rejected by the suite.

## Expected output
A versioned evaluation strategy with dimensions, methods, datasets, thresholds, release gates, ownership, and known limitations.

## Stop conditions
Stop and escalate when product intent is ambiguous, critical risks lack testable acceptance criteria, or available evidence cannot support a defensible release threshold.