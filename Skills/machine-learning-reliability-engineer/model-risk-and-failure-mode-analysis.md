# Model Risk and Failure Mode Analysis

## Purpose
Systematically identify how an ML system can fail, estimate the operational consequence of each failure mode, and prioritize controls before incidents occur.

## When to use
Use during architecture reviews, pre-launch readiness, major model or data changes, incident follow-up, and periodic reliability reassessment.

## Inputs
- System architecture and data flow
- Model objective and decision semantics
- Critical user journeys
- Historical incidents and known limitations
- SLOs, safety constraints, and fallback behavior

## Context to inspect
Inspect data producers, feature pipelines, training and serving paths, thresholds, dependencies, model routing, feedback loops, human review, downstream side effects, and recovery mechanisms.

## Core knowledge
ML reliability failure modes include invalid or stale inputs, train-serve skew, distribution shift, model corruption, threshold misconfiguration, biased routing, serving saturation, dependency failure, feedback loops, label defects, and unsafe degradation. Risk should consider severity, likelihood, detectability, duration, blast radius, and recoverability rather than prediction error alone.

## Procedure
1. Define the system boundary and critical outcomes.
2. Decompose the ML lifecycle into data, training, evaluation, artifact, deployment, serving, monitoring, and feedback components.
3. Enumerate credible failure modes for each component.
4. Describe the observable effect and downstream consequence of each failure.
5. Score or rank severity, likelihood, detectability, blast radius, and recovery difficulty.
6. Identify existing preventive, detective, and corrective controls.
7. Find single points of failure and correlated failure domains.
8. Prioritize gaps where impact is high and detection or recovery is weak.
9. Assign concrete mitigations, owners, and verification methods.
10. Link high-priority risks to alerts, runbooks, fallbacks, release gates, or game-day scenarios.
11. Reassess the analysis after major incidents or architectural changes.

## Decision points
Use hard prevention controls when the consequence is unacceptable, detection plus rollback when reversible failures are tolerable, and human approval where automated evidence cannot sufficiently bound risk. Do not spend equal effort on low-impact and catastrophic failure modes.

## Common failure patterns
- Focusing only on model accuracy failures.
- Treating dependent services as statistically independent.
- Listing risks without owners or testable mitigations.
- Ignoring recovery time and rollback compatibility.
- Reusing stale risk assessments after system changes.

## Verification
Verify every high-priority failure mode has at least one effective prevention, detection, or recovery control and that critical controls have been exercised or otherwise evidenced.

## Expected output
A prioritized ML failure-mode register with impact analysis, controls, owners, verification evidence, and residual risk.

## Stop conditions
Stop release approval if a catastrophic credible failure has no acceptable mitigation, detection, fallback, or authorized risk acceptance.