# Documentation Observability and Analytics

## Purpose
Use behavioral and support evidence to find documentation gaps, measure usefulness, and prioritize maintenance.
## When to use
Use for mature doc sets with analytics, search, feedback, support, or issue data.
## Inputs
Page analytics, search queries, feedback, support cases, link data, product adoption.
## Context to inspect
Privacy constraints, bot traffic, navigation changes, release events, audience segments.
## Core knowledge
Page views are not success. Combine findability, task completion proxies, search refinement, exits, feedback, and support deflection cautiously.
## Procedure
1. Define documentation outcomes and questions.
2. Establish baseline metrics and instrumentation quality.
3. Segment by user journey/version where possible.
4. Analyze zero-result and repeated search queries.
5. Find high-traffic/high-exit or high-support topics.
6. Triangulate quantitative signals with user/support evidence.
7. Prioritize changes by impact and confidence.
8. Measure after changes over a suitable window.
9. Record hypotheses rather than claiming causality without evidence.
## Decision points
Use qualitative research when analytics explain where but not why; avoid collecting user data unnecessary for doc improvement.
## Common failure patterns
Optimizing views, noisy feedback widgets, ignoring search data, and attributing product changes to docs.
## Verification
Metrics definitions are reproducible and improvements are evaluated against baseline/guardrails.
## Expected output
Evidence-based documentation improvement backlog.
## Stop conditions
Stop analysis when instrumentation or privacy constraints make conclusions unreliable.