# Dashboard Design Rules

## Purpose
Ensure dashboards support decisions without hiding analytical assumptions.

## Scope
Applies to executive, operational, exploratory, and self-service dashboards.

## MUST
- Each dashboard MUST state its intended audience and decision context.
- Filters and default selections MUST not create a materially misleading initial view.
- Units, time ranges, comparison bases, and metric definitions MUST be visible or directly accessible.
- High-impact dashboards MUST define behavior for missing, partial, or stale data.

## MUST NOT
- MUST NOT overload a dashboard with unrelated metrics that lack a shared decision context.
- MUST NOT use interaction defaults that silently exclude material populations.

## SHOULD
- Dashboards SHOULD prioritize exceptions, trends, and decision-relevant context over decorative elements.

## Exceptions
Exceptions require documented user need, usability evidence, and reviewer approval.

## Verification
Review dashboard specification, default state, filter behavior, data-state handling, and usability feedback.