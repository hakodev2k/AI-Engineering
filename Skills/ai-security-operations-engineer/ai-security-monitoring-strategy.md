# AI Security Monitoring Strategy

## Purpose
Design a monitoring strategy for production AI systems that detects security-relevant misuse, compromise, policy bypass, data exposure, and infrastructure abuse without drowning responders in noise.

## When to use
Use when launching an AI service, expanding model or agent capabilities, revising detection coverage, or after an incident exposes blind spots. Do not treat generic infrastructure monitoring as sufficient for AI-specific threats.

## Inputs
System architecture, model and agent capabilities, trust boundaries, data flows, tool permissions, identity model, telemetry sources, risk register, existing alerts, incident history, and compliance constraints.

## Preconditions
The monitored system, owners, and critical assets are identifiable. At least basic telemetry collection is available or can be instrumented.

## Context to inspect
Review inference gateways, prompt pipelines, retrieval systems, model providers, tool execution paths, secrets stores, authentication flows, audit logs, network controls, moderation layers, and existing SIEM/SOAR integrations.

## Core knowledge
AI security monitoring must correlate conventional security signals with AI-specific behavior. High-value signals include unusual prompt patterns, repeated policy evasion, sensitive-data retrieval, anomalous tool invocation, cross-tenant access attempts, model extraction patterns, credential abuse, sudden token-volume shifts, and suspicious agent autonomy.

## Procedure
1. Define protected assets and threat outcomes.
2. Map trust boundaries and attack surfaces.
3. Enumerate observable signals for each high-priority threat.
4. Classify telemetry as preventive, detective, investigative, or forensic.
5. Identify missing telemetry that blocks reliable detection.
6. Define detection hypotheses and expected benign baselines.
7. Specify correlation rules across identity, model, application, tool, and infrastructure events.
8. Assign severity based on impact and confidence.
9. Define alert ownership and escalation paths.
10. Establish retention, privacy, and access controls for security telemetry.
11. Test monitoring with realistic attack simulations.
12. Review false positives and blind spots after deployment.

## Decision points
Prefer correlation over single-event alerts for noisy model interactions. Use stricter thresholds for high-impact tool actions and privileged workflows. Avoid collecting sensitive prompt content when metadata or structured features can provide equivalent detection value.

## Common failure patterns
Logging only application errors, treating prompt abuse as isolated content moderation, missing user or tenant identity in events, retaining sensitive content unnecessarily, alerting on volume without context, and failing to test whether detections actually fire.

## Verification
Implemented means required telemetry and alert logic exist. Verified means simulated abuse produces the expected signal, severity, routing, and responder context while representative benign traffic stays within an acceptable false-positive rate.

## Expected output
A monitoring plan with prioritized threats, signal sources, detection logic, alert routing, retention rules, telemetry gaps, and validation evidence.

## Stop conditions
Escalate when critical threats cannot be observed, required telemetry violates policy or privacy constraints, or system owners cannot define an accountable response path.