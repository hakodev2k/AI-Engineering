# AI SIEM Correlation Rules

## Purpose
Build reliable SIEM detections that correlate AI application, identity, model, retrieval, tool, and infrastructure events into security-relevant incidents.

## When to use
Use when single-source alerts lack context, when AI incidents span multiple services, or when detection engineering needs production-grade correlation logic.

## Inputs
Normalized telemetry, threat models, identity context, baselines, known attack sequences, severity definitions, and existing SIEM content.

## Preconditions
Key event sources have stable schemas and usable correlation identifiers.

## Context to inspect
Review inference logs, authentication events, tool execution, retrieval access, WAF/network data, secrets alerts, moderation signals, deployment changes, and existing correlation windows.

## Core knowledge
Effective correlation joins weak signals into stronger evidence. Rules should represent attack hypotheses, not arbitrary event combinations, and must account for event latency, duplicate telemetry, retries, and distributed attacker behavior.

## Procedure
1. Define the threat outcome and observable sequence.
2. Identify required and optional signals.
3. Choose stable join keys such as principal, tenant, session, credential, request, or campaign identifiers.
4. Set correlation windows based on realistic attacker timing.
5. Weight achieved-impact events above attempted actions.
6. Add suppressions for known benign workflows.
7. Include enough evidence in alerts for rapid triage.
8. Test against positive, negative, duplicate, delayed, and partial-event cases.
9. Monitor rule cost and execution latency.
10. Version and review detections after system changes.

## Decision points
Use strict deterministic rules for high-confidence control violations; use risk scoring or aggregation for ambiguous behavioral patterns. Do not suppress rare high-impact events merely to reduce volume.

## Common failure patterns
Joining on unstable session IDs, huge correlation windows, duplicate alerts per retry, brittle provider-specific fields, and rules without negative test cases.

## Verification
Implemented means rules execute on production telemetry. Verified means attack simulations produce one appropriately enriched incident, benign scenarios do not, and delayed/duplicate events behave predictably.

## Expected output
Versioned SIEM rules, mappings to threat hypotheses, tests, severity, suppressions, and responder context.

## Stop conditions
Escalate when required telemetry is absent, join keys are unreliable, or rule execution cost threatens the monitoring platform.