# Evaluation Tooling for Developers

## Purpose
Provide repeatable evaluation workflows that help developers measure AI application quality before deployment instead of relying on a few manual examples.

## When to use
Use when building prompt applications, retrieval systems, agents, structured extraction, model migrations, or any feature whose behavior is probabilistic.

## Inputs
Task definition, representative datasets, expected outcomes, graders, model versions, application configuration, latency/cost data, and release criteria.

## Context to inspect
Inspect current test cases, production failures, prompt history, model settings, dataset provenance, evaluation scripts, score definitions, and CI integration.

## Core knowledge
AI evaluations need representative cases, explicit scoring criteria, reproducible configuration, and separation between development and holdout data. Offline metrics should be connected to user or operational outcomes. LLM-as-judge can scale evaluation but requires calibration and bias awareness.

## Procedure
1. Define the behavior to evaluate and decision the result informs.
2. Build representative normal, edge, and adversarial cases.
3. Record provenance and protect a holdout set where appropriate.
4. Choose deterministic checks for exact requirements.
5. Add human or model-based graders for semantic criteria.
6. Calibrate graders against expert examples.
7. Record model, prompt, tool, retrieval, and parameter versions.
8. Measure quality together with latency and cost.
9. Compare candidates using the same dataset and protocol.
10. Analyze regressions by failure category, not aggregate score alone.
11. Define release thresholds and acceptable uncertainty.
12. Integrate stable evaluations into CI or release workflows.

## Decision points
Use exact assertions for structural invariants; rubric grading for semantic quality; human review for ambiguous or high-impact cases. Avoid optimizing repeatedly against the same small benchmark.

## Common failure patterns
Tiny cherry-picked datasets, leaking holdout answers into prompts, unstable graders, opaque aggregate metrics, changing multiple variables at once, and declaring success without inspecting regressions.

## Verification
Repeat runs, confirm dataset and configuration versioning, manually inspect sampled grades, measure grader agreement, and verify CI fails on intentional regressions.

## Expected output
A versioned evaluation suite with datasets, graders, metrics, release thresholds, failure analysis, and reproducible commands.

## Stop conditions
Stop when success criteria are undefined, datasets contain prohibited data, grader reliability is insufficient, or evaluation evidence cannot support the requested release decision.