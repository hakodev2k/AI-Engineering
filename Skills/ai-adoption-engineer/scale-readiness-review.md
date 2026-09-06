# Scale Readiness Review

## Purpose
Determine whether an AI capability proven in a pilot is ready to expand across more users, workflows, data, geographies, or business units without exceeding operational and governance capacity.

## When to use
Use at the end of a successful pilot, before major cohort expansion, or before enterprise standardization.

## Inputs
Pilot results, adoption metrics, value evidence, incident history, support data, capacity limits, governance approvals, training status, integration reliability, and unresolved risks.

## Context to inspect
Inspect performance across user segments and edge cases, model/provider quotas, cost trends, support load, telemetry coverage, rollback mechanisms, data permissions, policy obligations, and change impacts.

## Core knowledge
Pilot success does not automatically generalize. Scale introduces broader user behavior, noisier data, more exceptions, larger blast radius, and greater support and cost demand. Senior review distinguishes capability readiness from organizational readiness.

## Procedure
1. Compare pilot outcomes with predefined success and guardrail criteria.
2. Confirm value persists after including review, support, and operating costs.
3. Assess unresolved quality and failure patterns.
4. Validate capacity, quotas, latency, and cost under projected load.
5. Confirm telemetry, incident response, and rollback coverage.
6. Review security, privacy, policy, and data-access requirements for expanded scope.
7. Verify training and support capacity for new cohorts.
8. Assess integration reliability and dependency ownership.
9. Identify assumptions that have not yet been tested at the next scale.
10. Define phased expansion gates and monitoring windows.
11. Recommend scale, limited scale, remediation, or stop.

## Decision points
Scale only dimensions supported by evidence. Keep high-risk workflows constrained while expanding lower-risk cohorts when uncertainties differ. Require remediation before expansion when failures become harder to detect or reverse at scale.

## Common failure patterns
Treating pilot averages as universal, ignoring support growth, extrapolating costs linearly without provider constraints, expanding data permissions casually, and scaling before rollback is proven.

## Verification
Every scale recommendation must cite pilot evidence, projected constraints, residual risks, ownership, and measurable gates for the next phase.

## Expected output
A scale-readiness decision with evidence, capacity assumptions, unresolved risks, required remediations, cohort plan, gates, and rollback conditions.

## Stop conditions
Stop when high-impact risks lack owners, projected capacity cannot meet service needs, governance approval is missing, or pilot evidence is not representative of the proposed scope.