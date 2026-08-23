# Root Cause and Contributing Factors

## Purpose
Identify the technical and systemic conditions that produced an incident without reducing complex failures to a single superficial cause.

## When to use
Use after stabilization when enough evidence exists for causal analysis.

## Inputs
Incident timeline, telemetry, changes, architecture, code/configuration, procedures, prior incidents, and recovery evidence.

## Context to inspect
Inspect triggering events, latent conditions, safeguards, organizational interfaces, automation, capacity assumptions, testing gaps, and detection behavior.

## Core knowledge
Root cause should explain why the failure occurred and why defenses did not prevent or limit it. Contributing factors often matter more for prevention than the immediate trigger.

## Procedure
1. State the failure and impact precisely.
2. Identify the triggering event supported by evidence.
3. Trace the causal chain through system behavior.
4. Identify conditions that allowed the trigger to become customer impact.
5. Examine missing, ineffective, or bypassed safeguards.
6. Separate root causes, contributing factors, detection gaps, and response gaps.
7. Test the explanation against all major symptoms.
8. Compare with similar prior incidents.
9. Derive prevention actions at multiple layers.
10. Record uncertainty where causality is not proven.

## Decision points
Prefer systemic explanations over individual blame. Stop causal depth where additional analysis no longer changes practical prevention decisions.

## Common failure patterns
Calling human error the root cause, stopping at the first code defect, confusing correlation with causation, forcing one root cause, and creating actions unrelated to causal factors.

## Verification
Ensure the causal model explains the timeline, observed symptoms, mitigation behavior, and recurrence risk.

## Expected output
An evidence-backed causal analysis with trigger, root causes, contributing factors, failed safeguards, and prevention opportunities.

## Stop conditions
Do not assert causality when evidence remains contradictory or unavailable; document uncertainty and assign further investigation if materially useful.