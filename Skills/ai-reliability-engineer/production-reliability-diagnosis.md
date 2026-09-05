# Production Reliability Diagnosis

## Purpose
Diagnose reliability degradation in production AI systems using evidence across user journeys, models, retrieval, tools, providers, queues, and infrastructure.

## When to use
Use for elevated latency, errors, quality regressions, partial outages, repeated timeouts, capacity saturation, or unexplained SLO burn.

## Inputs
Incident description, dashboards, traces, logs, deploy history, model/prompt versions, provider status, queue metrics, user examples.

## Preconditions
Preserve representative failing requests before changing the system when safe to do so.

## Context to inspect
Recent releases, feature flags, model routing, retrieval, tool calls, dependency health, network, capacity, configuration drift.

## Core knowledge
Senior diagnosis separates symptom location from causal location. AI failures often cross layers, and correlated timing is not proof of causation.

## Procedure
1. Define the exact user-visible failure and affected scope.
2. Establish onset time and compare with changes and dependency events.
3. Segment by model, version, route, tenant, region, request type, and context size.
4. Trace failing and healthy requests side by side.
5. Identify the earliest measurable divergence.
6. Test highest-value hypotheses with reversible experiments.
7. Contain ongoing harm before deep optimization.
8. Confirm root cause with evidence or controlled reproduction.
9. Implement the smallest safe remediation.
10. Monitor recovery against baseline and SLOs.

## Decision points
Rollback early when a recent reversible change strongly correlates with severe impact. Investigate capacity before scaling blindly. Treat provider status as one signal, not definitive proof.

## Common failure patterns
Changing multiple variables, blaming the model by default, using averages, ignoring queue age, assuming correlation equals cause, and declaring recovery after one healthy sample.

## Verification
Root-cause evidence explains affected and unaffected traffic, remediation reverses the failure, and SLOs remain stable through an observation window.

## Expected output
A scoped diagnosis, evidence-backed causal hypothesis, remediation, and recovery evidence.

## Stop conditions
Escalate immediately for safety, security, privacy, regulated-data, or irreversible-action impact.