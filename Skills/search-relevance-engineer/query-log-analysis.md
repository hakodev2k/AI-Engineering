# Query Log Analysis

## Purpose
Use search telemetry to identify relevance gaps, intent patterns, zero-result causes, reformulations, and opportunities for measurable improvement.

## When to use
Use during relevance audits, incident investigation, roadmap prioritization, or after major search changes.

## Inputs
Query logs, result counts, clicks, positions, reformulations, sessions, conversions, latency, locale and device metadata where permitted.

## Context to inspect
Logging schema, retention, sampling, bot filtering, privacy controls, session definitions, exposure logging, and metric quality.

## Core knowledge
Logs describe observed behavior under the current system and therefore contain position, exposure, and selection bias. Absence of clicks does not automatically mean irrelevance.

## Procedure
1. Validate logging completeness and privacy constraints.
2. Remove or segment bots and internal traffic.
3. Normalize queries without destroying meaningful distinctions.
4. Analyze frequency, zero-results, low-click, reformulation, abandonment, and latency cohorts.
5. Build session-level paths for repeated searches.
6. Segment by intent, locale, query length, and frequency.
7. Sample representative failures for manual review.
8. Connect failure categories to retrieval, ranking, content, or UX causes.
9. Quantify opportunity size before implementation.
10. Track affected cohorts after fixes.

## Decision points
Use behavioral signals for prioritization, not as unquestioned relevance labels. Aggregate only where privacy and traffic volume permit reliable interpretation.

## Common failure patterns
Treating CTR as ground truth, ignoring exposure bias, merging distinct locales, counting bots, over-normalizing queries, and prioritizing only head traffic.

## Verification
Recompute key cohorts independently, inspect raw examples, validate session logic, and confirm proposed fixes target the measured failure mechanism.

## Expected output
Prioritized query cohorts, quantified failure taxonomy, representative examples, root-cause hypotheses, and measurable follow-up criteria.

## Stop conditions
Stop when telemetry is materially incomplete, privacy restrictions prohibit analysis, or session/exposure definitions are unreliable.