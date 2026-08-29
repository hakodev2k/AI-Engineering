# Forensic Triage and Scoping

## Purpose
Rapidly determine incident scope, evidence priorities, and investigative direction without destroying higher-value evidence.

## When to use
Use at the start of endpoint, server, cloud, or insider investigations when facts are incomplete and time matters.

## Inputs
Incident description, affected assets, alerts, identities, telemetry, business impact, and known indicators.

## Context to inspect
Detection source, asset criticality, user roles, network topology, logging coverage, data retention, and containment actions already taken.

## Core knowledge
Senior triage balances speed against evidence preservation. The objective is not exhaustive analysis; it is to identify what happened, what may still be active, which systems matter most, and what evidence will answer the next decision.

## Procedure
1. Define the investigative questions and confidence level required.
2. Establish a provisional incident timeline.
3. Rank assets and evidence by volatility and business impact.
4. Identify likely entry point, execution, persistence, privilege, lateral movement, and exfiltration evidence.
5. Collect minimally invasive high-value artifacts first.
6. Expand scope using identities, indicators, infrastructure, and time windows.
7. Track hypotheses as confirmed, rejected, or unresolved.
8. Hand off containment recommendations separately from forensic conclusions.

## Decision points
Escalate from targeted triage to full acquisition when evidence suggests destructive activity, legal exposure, or uncertain scope. Avoid broad collection when it adds cost without answering a specific question.

## Common failure patterns
Tunnel vision on the first alert, conflating IOC matches with compromise, changing systems before volatile evidence is captured, and failing to record negative findings.

## Verification
Confirm each major conclusion maps to evidence and that unresolved questions are explicit.

## Expected output
Triage summary, scoped asset list, prioritized evidence plan, and current hypotheses.

## Stop conditions
Stop and escalate when active compromise requires emergency response, authorization limits investigation, or evidence retention is about to expire.