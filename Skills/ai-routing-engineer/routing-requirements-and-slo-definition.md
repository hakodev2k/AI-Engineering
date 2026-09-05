# Routing Requirements and SLO Definition

## Purpose
Define the routing contract for an AI gateway before implementing policies. The skill converts product, reliability, safety, latency, cost, residency, and quality requirements into measurable routing objectives and hard constraints.

## When to use
Use when designing a new routing layer, onboarding a workload, changing model/provider strategy, or investigating unclear routing behavior. Do not start by tuning routing weights before requirements are explicit.

## Inputs
Workload description, user journeys, model candidates, providers, latency targets, quality metrics, budget limits, compliance constraints, traffic shape, failure tolerance, and existing SLOs.

## Preconditions
Key stakeholders must agree on the critical user outcomes and which constraints are mandatory versus optimizable.

## Context to inspect
Existing gateway code, model catalog, provider contracts, evaluation results, observability, regional architecture, tenant policies, fallback behavior, and current incident history.

## Core knowledge
Routing is a constrained optimization problem. Hard constraints such as data residency, authorization, safety eligibility, and schema compatibility should filter candidates before soft objectives such as cost or latency are optimized. SLOs should be defined at the workload level and segmented when aggregate metrics hide high-risk users.

## Procedure
1. Identify distinct request classes and business criticality.
2. Define hard eligibility constraints for each class.
3. Define measurable quality metrics and minimum acceptable thresholds.
4. Define latency SLOs including percentile targets and timeout budgets.
5. Define cost ceilings or budget objectives.
6. Define availability and fallback expectations.
7. Capture security, privacy, and residency requirements.
8. Define acceptable degradation modes.
9. Rank competing soft objectives.
10. Specify evidence required to change a routing policy.
11. Record assumptions and unresolved risks.

## Decision points
Use separate routing policies when workload objectives materially differ. Prefer hard disqualification over weighted penalties for compliance and safety constraints. Avoid one global score when metrics have incomparable scales or non-negotiable thresholds.

## Common failure patterns
Optimizing only cost, relying on average latency, failing to define minimum quality, treating fallback as equivalent behavior, and allowing compliance constraints to be overridden by weights.

## Verification
Review requirements against representative traffic and confirm every route decision can be explained by documented constraints and objectives.

## Expected output
A routing requirements specification with request classes, eligibility rules, SLOs, optimization priorities, degradation modes, and open risks.

## Stop conditions
Stop and escalate when critical quality metrics are unavailable, compliance requirements conflict, or stakeholders cannot define acceptable degraded behavior.