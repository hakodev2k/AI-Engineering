# Dashboard Rules

## Purpose
Ensure operational dashboards communicate trustworthy system state and support rapid investigation.

## Scope
Applies to executive, service, model, reliability, quality, cost, and incident dashboards.

## MUST
- Every operational dashboard MUST identify its audience, decision purpose, time range assumptions, and data freshness.
- Panels MUST use metrics with documented semantics and units.
- Health dashboards MUST expose user-facing outcomes alongside critical component signals.
- Dashboards used during incidents MUST provide drill-down paths to traces, logs, dependencies, and deployment changes.
- Missing or delayed telemetry MUST be visually distinguishable from healthy zero values.

## MUST NOT
- Dashboards MUST NOT use unlabeled transformations that obscure source metric meaning.
- Global aggregates MUST NOT hide known high-risk segments when those segments can fail independently.
- Decorative panels MUST NOT displace critical decision signals on incident views.

## SHOULD
- Group related reliability, latency, quality, and cost signals by user journey.
- Show baseline or historical context for metrics prone to natural variability.

## Exceptions
Specialized exploratory dashboards may omit some production conventions if clearly labeled non-authoritative.

## Verification
Review dashboard definitions, data sources, freshness indicators, units, drill-down links, and behavior during controlled telemetry loss or a known historical incident.