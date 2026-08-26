# Product Feedback Synthesis

## Purpose
Transform developer feedback into evidence-rich, prioritized product insight without turning anecdotes into false consensus.

## When to use
Use after events, community discussions, support patterns, launches, betas, or research programs.

## Inputs
Feedback records, usage context, segment, frequency signals, product goals, roadmap constraints, telemetry where available.

## Context to inspect
Original wording, developer job, environment, workaround, severity, adoption stage, duplicates, related issues, and business/technical constraints.

## Core knowledge
Feedback is evidence about a problem, not automatically the correct solution. Separate request, underlying job, observed friction, proposed fix, and prevalence.

## Procedure
1. Preserve source context and anonymize where needed.
2. Normalize feedback into problem statements.
3. Cluster by underlying job/failure rather than requested feature name.
4. Record affected segments and adoption stages.
5. Estimate frequency with explicit confidence.
6. Quantify impact using telemetry/support evidence when possible.
7. Identify workarounds and their costs.
8. Distinguish defects, missing capabilities, usability, docs, and expectation gaps.
9. Present ranked themes with representative evidence and counter-signals.
10. Track product decisions and communicate closure back to developers when appropriate.

## Decision points
Escalate low-frequency/high-severity issues despite limited volume. Do not equate loudness with prevalence. Route documentation problems separately from product gaps.

## Common failure patterns
Feature-vote counting, stripping context, cherry-picking, overstating sample size, losing negative evidence, and collecting feedback without closure.

## Verification
Every synthesized theme must trace to evidence, state confidence, identify affected users, and distinguish observed problem from proposed solution.

## Expected output
A prioritized feedback brief with evidence, impact, confidence, hypotheses, and ownership/closure status.

## Stop conditions
Stop when source consent or confidentiality is unclear, evidence is too weak for the claimed conclusion, or sensitive customer details cannot be safely shared.