# Reliability Requirements and SLOs

## Purpose
Define measurable reliability objectives for AI systems across availability, latency, correctness, safety, tool execution, retrieval quality, and graceful degradation.

## When to use
Use when designing a new AI service, preparing a production launch, reviewing reliability risk, or tightening operational expectations after incidents. Do not use SLOs as substitutes for product acceptance criteria or safety policy.

## Inputs
User journeys, business criticality, architecture, model/provider dependencies, traffic patterns, failure history, current telemetry, error budgets, safety and compliance constraints.

## Preconditions
Critical user journeys and owners are known. Baseline measurements should exist when possible.

## Context to inspect
Request paths, model gateways, retrieval, tools, queues, external providers, fallback routes, SLAs, monitoring, incident history, deployment strategy.

## Core knowledge
AI reliability extends beyond HTTP uptime. A request can succeed technically while returning unusable, unsafe, stale, or structurally invalid output. Senior reliability work defines observable service-level indicators that represent actual user outcomes and separates controllable internal SLOs from third-party SLAs.

## Procedure
1. Identify critical user journeys and failure consequences.
2. Define reliability dimensions that materially affect each journey.
3. Select SLIs that can be measured consistently.
4. Establish baselines from representative production or load data.
5. Set target SLOs based on business need and system capability.
6. Define error-budget policy and escalation thresholds.
7. Segment SLOs where global aggregates would hide tenant, region, or model-specific failures.
8. Map each SLO to dashboards, alerts, and ownership.
9. Define degraded-mode behavior for SLO breaches.
10. Review SLOs after architectural or provider changes.

## Decision points
Use stricter targets for irreversible tool actions or safety-critical workflows. Avoid impossible objectives that force teams to ignore error budgets. Separate provider performance targets from end-to-end user SLOs.

## Common failure patterns
Tracking only HTTP success rate, defining unmeasurable quality SLOs, using averages instead of percentiles, ignoring third-party dependencies, and setting targets without an error-budget response policy.

## Verification
Confirm each SLO has a computable SLI, trusted data source, owner, alert threshold, and documented response when the budget is exhausted.

## Expected output
A reliability specification containing critical journeys, SLIs, SLO targets, error budgets, segmentation, ownership, and degraded-mode policy.

## Stop conditions
Escalate when required reliability cannot be achieved with the current architecture, provider contract, budget, or safety constraints.