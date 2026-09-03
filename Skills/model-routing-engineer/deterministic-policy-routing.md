# Deterministic Policy Routing

## Purpose
Design explicit, auditable routing rules for workloads whose constraints can be expressed directly.

## When to use
Use for compliance, tenancy, modality, region, context-size, tool-support, or hard latency/cost constraints.

## Inputs
Traffic attributes, capability registry, policy requirements, provider health, quotas, test cases.

## Context to inspect
Request metadata, authentication claims, prompt size, modality, data classification, regional rules, existing fallback behavior.

## Core knowledge
Policy routing should be ordered, deterministic, explainable, and fail closed for hard constraints. Separate eligibility from preference: first determine allowed models, then rank them.

## Procedure
1. Enumerate hard eligibility constraints.
2. Normalize request attributes.
3. Filter candidate models by policy and capability.
4. Apply preference rules to eligible candidates.
5. Define tie-breakers explicitly.
6. Add fallback rules that never violate hard constraints.
7. Emit a decision reason code.
8. Build table-driven tests for boundary cases.
9. Shadow-test policy changes before rollout.

## Decision points
Use rules when explainability and deterministic compliance dominate. Move to scoring only for preference optimization after eligibility filtering.

## Common failure patterns
Rule-order bugs, implicit defaults, policy bypass in retries, conflicting rules, hidden provider aliases, and fallback to an ineligible model.

## Verification
Verify exhaustive policy tests, reproducible decisions, correct reason codes, and negative tests proving prohibited routes are impossible.

## Expected output
A tested policy graph or ruleset with eligibility filters, preference ordering, and audit reasons.

## Stop conditions
Stop if policy precedence is ambiguous or required request attributes are unavailable.