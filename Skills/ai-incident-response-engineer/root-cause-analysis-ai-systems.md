# Root Cause Analysis for AI Systems

## Purpose
Identify systemic causes of an AI incident rather than stopping at the first observable model or application symptom.

## When to use
Use after containment when sufficient evidence exists to investigate contributing technical and process causes.

## Inputs
Timeline, traces, versions, experiments, deploy history, alerts, architecture, change reviews, test coverage.

## Preconditions
Incident is stable enough for controlled analysis.

## Context to inspect
Model/prompt lifecycle, RAG, tools, data pipelines, provider dependencies, safeguards, rollout controls, monitoring, ownership processes.

## Core knowledge
AI incidents often have multiple contributing causes: a model regression may combine with weak evaluation, permissive tool access, missing canarying, and poor detection.

## Procedure
1. Define the precise failure and impact.
2. Identify the earliest causal divergence.
3. Build a causal chain from trigger to user harm.
4. Test competing hypotheses with replay or controlled experiments.
5. Identify why prevention controls failed.
6. Identify why detection was late or noisy.
7. Identify why blast radius was not smaller.
8. Separate root causes, contributing factors, and incidental observations.
9. Propose corrective actions tied to each cause.
10. Validate that actions would have prevented or reduced recurrence.

## Decision points
Do not label unavoidable model stochasticity as root cause if system controls should have bounded it.

## Common failure patterns
Five-whys without evidence, blaming individuals, calling the model the root cause, and producing actions unrelated to causal factors.

## Verification
Each causal claim is evidence-backed and proposed controls break the demonstrated causal chain.

## Expected output
Evidence-based RCA with causal graph/chain, contributing factors, and prioritized corrective actions.

## Stop conditions
Escalate unresolved security/privacy/safety causality to the relevant specialist process.