# Threat Hunting

## Purpose
Conduct hypothesis-driven searches for adversary behavior not adequately covered by existing alerts.

## When to use
Use for emerging threats, intelligence-led hypotheses, post-incident assurance, coverage validation or suspicious weak signals.

## Inputs
Threat hypothesis, ATT&CK behavior, environment knowledge, telemetry, baselines, intelligence and hunt timebox.

## Context to inspect
Assess data coverage and blind spots before interpreting negative results. Identify likely entry points, identities, critical assets and platform-specific normal behavior.

## Core knowledge
A hunt should be falsifiable and time-bounded. Hunting is not unstructured searching; it should produce findings, detection improvements, telemetry gaps or a documented negative result.

## Procedure
1. State hypothesis, scope and success criteria.
2. Map required observables and data sources.
3. Validate telemetry health.
4. Establish relevant baseline behavior.
5. Query broad behavioral signals.
6. Pivot from anomalies using entity and timeline context.
7. Preserve suspicious evidence and open cases when warranted.
8. Track tested sub-hypotheses.
9. Convert repeatable findings into detections.
10. Document coverage gaps and recommended telemetry.
11. Close with confidence and limitations.

## Decision points
Use intelligence indicators for scoping, but prefer behavior for durable discovery. Expand scope only when evidence increases posterior likelihood; otherwise respect the timebox.

## Common failure patterns
IOC-only hunting; assuming no hits means no compromise; cherry-picking anomalies; no baseline; no operational output.

## Verification
Queries are reproducible, data coverage is stated, suspicious findings are case-managed, and reusable detection or telemetry actions are captured.

## Expected output
A hunt report containing hypothesis, evidence, results, limitations and engineering follow-ups.

## Stop conditions
Transition to incident response when active compromise is likely; stop when required telemetry is unavailable or the hypothesis is no longer testable.