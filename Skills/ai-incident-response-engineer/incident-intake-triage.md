# Incident Intake and Triage

## Purpose
Provide a repeatable method to classify, prioritize, and route AI-system incidents so response effort matches user impact, safety risk, security exposure, and operational urgency.

## When to use
Use for alerts, user reports, anomalous model behavior, AI safety complaints, elevated error rates, data exposure concerns, runaway agents, or provider degradation. Do not use as a substitute for emergency shutdown procedures already defined by the organization.

## Inputs
Incident report, alerts, affected services/models, recent changes, logs, traces, metrics, user impact, safety/security signals, dependency status.

## Preconditions
Confirm access to incident tooling and read-only production evidence. Avoid destructive actions during triage.

## Context to inspect
Service topology, model/provider configuration, prompt/version history, deployment history, tool permissions, retrieval sources, feature flags, SLOs, known-issue register.

## Core knowledge
AI incidents can originate in application code, prompts, model behavior, retrieval, tool execution, data quality, external providers, safety controls, or ordinary infrastructure. Severity must account for blast radius, reversibility, data sensitivity, autonomy, and potential harm—not only uptime.

## Procedure
1. Record detection time, reporter, affected surface, and symptoms.
2. Confirm the issue is current and reproducible enough to investigate.
3. Identify affected users, tenants, regions, models, versions, and workflows.
4. Classify the dominant incident dimension: availability, correctness, safety, security, privacy, cost, latency, data, agent/tooling, or dependency.
5. Estimate blast radius and whether impact is growing.
6. Check for sensitive-data exposure, unauthorized actions, or harmful outputs.
7. Assign severity using existing policy; escalate severity when uncertainty is high and potential harm is large.
8. Identify the fastest safe containment option.
9. Open or update the incident record with evidence and current hypothesis.
10. Assign incident ownership and specialist responders.
11. Define the next verification checkpoint and what evidence would change severity.

## Decision points
Prefer immediate containment over deep diagnosis when harm is ongoing. Prefer degraded safe mode over full shutdown when critical functionality can remain trustworthy. Escalate to security/privacy/safety leads whenever those boundaries may be crossed.

## Common failure patterns
Treating hallucinations as harmless correctness bugs, ignoring tenant-specific blast radius, downgrading incidents before evidence is stable, conflating symptoms with root cause, and delaying containment while searching for certainty.

## Verification
Verify severity against documented criteria, confirm the incident owner, validate the affected scope with telemetry, and ensure containment status is explicit.

## Expected output
A timestamped triage record containing classification, severity, blast radius, owner, current hypothesis, containment decision, and next checkpoint.

## Stop conditions
Stop triage and escalate when there is credible active harm, regulated-data exposure, unauthorized tool execution, unclear authority for containment, or insufficient access to determine scope.