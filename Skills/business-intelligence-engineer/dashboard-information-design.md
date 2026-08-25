# Dashboard Information Design

## Purpose
Design dashboards that communicate decision-relevant information accurately, efficiently, and with appropriate analytical context.

## When to use
Use for executive, operational, diagnostic, or analytical dashboards and major dashboard redesigns.

## Inputs
Audience, decisions, KPIs, dimensions, usage context, device constraints, accessibility requirements, data latency.

## Context to inspect
Inspect current dashboards, user workflows, metric definitions, common questions, filter behavior, telemetry, and accessibility standards.

## Core knowledge
A dashboard is an information interface, not a chart collection. Visual encodings must match comparison tasks; context, hierarchy, units, uncertainty, and exceptions determine interpretability.

## Procedure
1. Identify audience and concrete decisions supported.
2. Rank questions by frequency and consequence.
3. Select only governed metrics needed for those questions.
4. Establish visual hierarchy from status to explanation to detail.
5. Choose chart forms based on comparison, trend, distribution, composition, or relationship tasks.
6. Define filters, defaults, cross-highlighting, and drill behavior.
7. Include targets, baselines, units, freshness, and explanatory context.
8. Remove decorative elements that reduce signal density.
9. Test accessibility, responsive behavior, and keyboard/screen-reader support where applicable.
10. Validate comprehension with representative users and instrument usage.

## Decision points
Use tables when exact lookup dominates; charts when pattern recognition dominates. Use drill-through rather than overcrowding the primary view. Avoid dual axes unless interpretation is demonstrably clear.

## Common failure patterns
Too many KPIs, misleading axes, inconsistent colors/units, default filters hiding data, chart junk, inaccessible interactions, and unexplained metric changes.

## Verification
Run task-based usability checks, compare displayed values to canonical measures, test filters and edge states, and review load performance.

## Expected output
A decision-focused dashboard specification or implementation with validated metrics, interactions, accessibility, and usability evidence.

## Stop conditions
Stop when audience/decision purpose is undefined, metric definitions are ungoverned, or requested visualization would materially misrepresent the data.