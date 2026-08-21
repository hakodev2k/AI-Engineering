# AI Deployment and Release Engineering

## Purpose
Release AI changes safely with versioning, staged rollout, rollback, and production validation.

## When to use
Use for model, prompt, retrieval, tool, agent, embedding, or fine-tuning changes that affect production behavior.

## Inputs
Candidate artifacts, evaluation results, deployment topology, SLOs, rollback mechanism, traffic segmentation, provider version policy.

## Preconditions
All behavior-changing artifacts must be identifiable by version and pass defined release gates.

## Context to inspect
CI/CD, feature flags, prompt store, model aliases, index versions, secrets, environment parity, current dashboards, previous incidents.

## Core knowledge
AI releases often combine code and non-code artifacts. A model alias, prompt, embedding model, or index can change behavior even when application code does not. Safe releases require immutable references where possible, explicit compatibility, canaries, and rollback.

## Procedure
1. Record exact versions of code, prompt, model, schema, index, and tools.
2. Run deterministic tests and AI evaluations.
3. Verify configuration and provider limits in the target environment.
4. Deploy behind a feature flag or canary when risk is material.
5. Compare quality, latency, cost, safety, and error metrics with baseline.
6. Expand traffic gradually only when thresholds hold.
7. Keep prior artifacts available for rollback.
8. Validate rollback in non-production before relying on it.
9. Document material behavior changes and compatibility constraints.
10. Remove obsolete artifacts only after the rollback window closes.

## Decision points
Use canaries for behavior-sensitive changes; shadow traffic when outputs can be compared without user impact. Pin versions when provider aliases may drift unexpectedly.

## Common failure patterns
Deploying prompt and model changes simultaneously without attribution, no rollback, mutable aliases, index/model incompatibility, and judging success only by HTTP health.

## Verification
Confirm release gates, canary metrics, version telemetry, and a tested rollback path.

## Expected output
A traceable production release with staged evidence and recoverability.

## Stop conditions
Stop when artifacts cannot be versioned, rollback is impossible for a high-risk change, or required evaluation gates fail.