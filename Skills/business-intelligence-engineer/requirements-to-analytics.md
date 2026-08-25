# Requirements to Analytics

## Purpose
Translate ambiguous stakeholder questions into testable analytical requirements, governed metrics, and deliverable BI behavior.

## When to use
Use before building dashboards, datasets, KPIs, or analytical features.

## Inputs
Stakeholder goals, decisions, workflows, source availability, definitions, constraints, deadlines.

## Context to inspect
Inspect existing reports, metric catalog, business process documentation, source systems, prior requests, and usage telemetry.

## Core knowledge
Stakeholders often request a visualization when the real requirement is a decision, exception, or workflow. Senior BI work separates business question, metric semantics, dimensions, latency, interaction, and acceptance evidence.

## Procedure
1. Identify the decision or action the output must support.
2. Define audience and frequency of use.
3. Convert vague terms into measurable definitions.
4. Specify grain, dimensions, time basis, filters, and comparison baselines.
5. Identify authoritative sources and data limitations.
6. Define freshness, history, security, and performance expectations.
7. Sketch analytical behavior before implementation.
8. Define acceptance examples with known expected values.
9. Surface assumptions, dependencies, and risks.
10. Obtain agreement on semantic and operational requirements before expensive build work.

## Decision points
Build a dashboard when repeated interactive monitoring is needed; use scheduled reporting for stable periodic distribution; use exploratory analysis when the question is not yet stable enough to productize.

## Common failure patterns
Implementing requested chart types without understanding decisions, undefined KPI terms, hidden Excel logic, no acceptance examples, and assuming real-time data is necessary.

## Verification
Walk through representative business scenarios and expected values; ensure every acceptance criterion maps to model/report behavior and source evidence.

## Expected output
An implementable analytical contract covering purpose, semantics, data, interactions, NFRs, risks, and acceptance tests.

## Stop conditions
Stop when the decision purpose cannot be established, core metric semantics remain disputed, or required data does not exist and no acceptable proxy is approved.