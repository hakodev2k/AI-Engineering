# AI Test Strategy

## Purpose
Define a risk-based test strategy for AI-enabled products, models, agents, and workflows. The goal is to combine conventional software assurance with evaluation of probabilistic behavior, model regressions, misuse, safety, and operational failure.

## When to use
Use when introducing or materially changing an AI feature, model, prompt stack, retrieval layer, tool-using agent, or production workflow. Do not rely on this skill alone for narrow implementation-only unit tests.

## Inputs
Requirements, architecture, model/provider choices, user journeys, model evaluations, known risks, production constraints, data sensitivity, SLAs/SLOs, and release process.

## Preconditions
The system boundary and critical user outcomes are understood well enough to identify failure impact.

## Context to inspect
Inspect application code, prompts, model configuration, retrieval/tooling, guardrails, telemetry, release controls, existing tests, incidents, and evaluation datasets.

## Core knowledge
AI testing must address deterministic software correctness and stochastic model quality. Coverage should include functional behavior, quality, robustness, safety, security, latency, cost, reliability, data handling, and human fallback. Test evidence must be versioned against model, prompt, data, and system configuration.

## Procedure
1. Identify critical user outcomes and unacceptable failures.
2. Map architecture components and AI-specific failure surfaces.
3. Classify risks by severity, likelihood, detectability, and reversibility.
4. Define test layers: unit, integration, contract, end-to-end, evaluation, adversarial, load, and production monitoring.
5. Define golden cases plus difficult and edge cases.
6. Separate hard assertions from score-based evaluation.
7. Specify thresholds and release gates.
8. Define model/prompt/data version capture for reproducibility.
9. Assign automated versus human review paths.
10. Define regression suites and production feedback loops.
11. Specify rollback triggers and ownership.

## Decision points
Prefer deterministic assertions for software contracts and invariant behavior. Use statistical or rubric-based evaluation for open-ended outputs. Increase human review when stakes are high or automated graders are weak.

## Common failure patterns
Testing only happy paths, relying on one benchmark, ignoring model drift, unversioned prompts, hidden evaluator bias, no negative cases, and treating a single successful run as proof.

## Verification
Confirm every material risk maps to a test or explicit acceptance decision. Confirm release gates are measurable and the suite can be rerun against a pinned system configuration.

## Expected output
A risk-ranked test strategy with coverage matrix, evaluation criteria, release gates, regression plan, ownership, and escalation rules.

## Stop conditions
Stop when critical requirements, safety ownership, system boundaries, or reproducibility information are missing.