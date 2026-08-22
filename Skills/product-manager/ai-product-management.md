# AI Product Management

## Purpose
Manage AI-enabled products where capability is probabilistic, evaluation is multidimensional, costs vary with usage, and safety or trust failures can dominate value.

## When to use
Use for generative AI, predictive features, agents, recommendations, or workflows where model behavior materially affects customer outcomes.

## Inputs
User problem, candidate AI capability, model options, evaluation data, latency and cost constraints, safety requirements, human workflow, and fallback options.

## Context to inspect
Inspect whether AI is necessary, data rights, model limitations, failure consequences, prompt/context architecture, human oversight, telemetry, and provider dependencies.

## Core knowledge
AI product quality is a distribution of outcomes, not deterministic correctness. Evaluate task success, harmful failures, latency, cost, robustness, and user trust together.

## Procedure
1. Define the user task and why AI may outperform simpler approaches.
2. Specify acceptable and unacceptable failure modes.
3. Build representative evaluation cases before broad launch.
4. Establish quality, latency, cost, safety, and reliability metrics.
5. Compare model and non-model baselines.
6. Design user controls, uncertainty handling, and human escalation.
7. Validate privacy, data usage, and provider constraints.
8. Roll out gradually with production monitoring.
9. Analyze failure clusters and regressions.
10. Re-evaluate model choice as capability, cost, or risk changes.

## Decision points
Prefer deterministic software when rules are stable and correctness is required. Use human review when errors are consequential and automation confidence is insufficient.

## Common failure patterns
Demo-driven product decisions, no eval set, treating hallucination as one metric, unlimited agent autonomy, ignoring token cost, and silent model changes.

## Verification
Representative evaluations pass thresholds, guardrails are tested, fallback behavior works, and production metrics capture quality and cost.

## Expected output
AI product requirements, evaluation plan, safety boundaries, rollout plan, and measurable operating criteria.

## Stop conditions
Stop when data rights are unclear, unacceptable failures cannot be controlled, or evaluation cannot establish adequate confidence.