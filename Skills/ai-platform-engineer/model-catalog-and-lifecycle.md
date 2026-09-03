# Model Catalog and Lifecycle

## Purpose
Maintain a trustworthy inventory of models available through the AI platform, including capabilities, ownership, approval status, versions, deprecations, and operational constraints.

## When to use
Use when onboarding a model, changing provider versions, retiring a model, reviewing approved AI dependencies, or exposing model discovery to internal teams.

## Inputs
- Provider/model metadata
- Security and legal approvals
- Benchmark and evaluation results
- Cost and quota data
- Deprecation notices
- Platform compatibility data

## Context to inspect
Inspect current aliases, application dependencies, provider release notes, evaluation suites, incident history, contract terms, regional availability, and production traffic.

## Core knowledge
A model name is not a sufficient contract. Catalog entries should capture immutable version identity where available, capabilities, context limits, modalities, data-handling constraints, price dimensions, deployment regions, known failure modes, and lifecycle state.

## Procedure
1. Define catalog schema and ownership.
2. Record canonical and provider-native identifiers.
3. Capture supported modalities, limits, and feature flags.
4. Attach approval and data-handling classifications.
5. Link benchmark evidence and known limitations.
6. Record pricing, quotas, and region availability.
7. Define lifecycle states such as experimental, approved, deprecated, blocked, and retired.
8. Define alias semantics and whether aliases may move automatically.
9. Identify applications depending on each model.
10. Publish deprecation windows and migration guidance.
11. Validate replacements before retirement.
12. Audit the catalog regularly for drift.

## Decision points
- Prefer pinned versions for critical workloads when providers expose them.
- Use movable aliases only when teams accept controlled behavior changes.
- Block models when policy or reliability risk exceeds migration cost.

## Common failure patterns
- Treating aliases as immutable versions.
- Missing dependency visibility.
- Silent provider upgrades.
- Catalog entries without evidence or owners.
- Retiring models before validating replacements.

## Verification
Verify catalog entries against live provider metadata, policy systems, evaluation records, and actual application dependencies. A catalog entry is verified only when its documented capabilities and lifecycle state match operational reality.

## Expected output
An auditable model catalog with lifecycle state, capability metadata, policy classification, evidence, dependencies, and migration guidance.

## Stop conditions
Stop when provider version identity is ambiguous, approvals are missing, or retirement would break unknown consumers.