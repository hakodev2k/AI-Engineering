# Research Synthesis and Opportunity Framing

## Purpose
Convert heterogeneous human-AI research evidence into coherent patterns, opportunity areas, risks, and decision-ready implications without flattening uncertainty.

## When to use
Use after multiple studies, ongoing discovery, mixed-method programs, incident reviews, or when teams need a cross-study view rather than isolated findings.

## Inputs
Study findings, raw evidence where needed, telemetry, model evaluations, support data, product context, user segments, and decision priorities.

## Context to inspect
Inspect study methods, samples, system versions, dates, confidence levels, contradictory findings, known product changes, and unresolved questions.

## Core knowledge
Synthesis must preserve evidence provenance and methodological limits. Repeated themes across weakly independent sources do not automatically become strong evidence. Opportunities should describe user or system problems before prescribing solutions.

## Procedure
1. Normalize studies by date, population, task, system version, and method.
2. Extract evidence-backed findings and their confidence or limitations.
3. Cluster findings around user goals, workflow stages, failure mechanisms, and risks.
4. Identify convergent, contradictory, and version-specific evidence.
5. Separate persistent problems from transient implementation defects.
6. Map problems to affected users, consequences, and current workarounds.
7. Frame opportunity areas without prematurely selecting features.
8. Prioritize by user impact, strategic relevance, evidence strength, risk, and reversibility.
9. Record unresolved assumptions and research gaps.
10. Review synthesis with design, engineering, product, and relevant domain specialists.

## Decision points
Elevate high-severity risks even with low frequency when evidence is credible. Prefer further research over forced prioritization when contradictory evidence affects a consequential decision.

## Common failure patterns
Affinity mapping without provenance, majority-vote prioritization, treating all studies as equally strong, solution-first opportunities, ignoring model-version drift, and suppressing inconvenient contradictions.

## Verification
Every synthesized claim must trace to source evidence and retain scope limitations. Stakeholders should be able to distinguish known findings, hypotheses, and open questions.

## Expected output
A decision-oriented synthesis containing evidence clusters, opportunity areas, risks, confidence, contradictions, priorities, and research gaps.

## Stop conditions
Stop when source studies are not comparable enough for the proposed claim, provenance is missing, or synthesis would conceal a material unresolved safety issue.