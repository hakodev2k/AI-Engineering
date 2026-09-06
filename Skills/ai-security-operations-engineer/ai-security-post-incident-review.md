# AI Security Post-Incident Review

## Purpose
Run a blameless, evidence-driven review after an AI security incident to identify systemic causes, detection and response gaps, control failures, and durable prevention work.

## When to use
Use after material incidents, near misses with high potential impact, repeated abuse patterns, or failures that exposed important monitoring blind spots.

## Inputs
Incident timeline, evidence, alerts, responder notes, affected architecture, model and policy versions, containment actions, customer impact, and remediation status.

## Preconditions
Immediate containment is stable and enough evidence exists to reconstruct the event with appropriate confidence.

## Context to inspect
Review design assumptions, trust boundaries, identity controls, retrieval authorization, agent permissions, provider settings, telemetry, detection logic, alert routing, playbooks, deployment history, and organizational handoffs.

## Core knowledge
The goal is not to identify the person who made the last mistake. Senior review distinguishes triggering events from enabling conditions and asks why defenses allowed the issue to progress. AI-specific analysis should include nondeterminism, model/version changes, prompt context, tool autonomy, and data provenance.

## Procedure
1. Establish a factual timeline with confidence labels.
2. Define actual and potential impact.
3. Identify the initiating condition and exploitation path.
4. Analyze preventive controls that failed or were absent.
5. Analyze detection signals, delays, false assumptions, and missing telemetry.
6. Review triage, containment, recovery, and verification decisions.
7. Separate root causes, contributing factors, and incidental observations.
8. Identify where system design created unsafe reliance on human vigilance.
9. Create remediation items with owners, priority, due criteria, and verification methods.
10. Add or improve detection regression scenarios.
11. Update playbooks and architecture documentation.
12. Track actions to verified closure, not merely implementation.

## Decision points
Prioritize systemic fixes over one-off filters. Accept residual risk only when an accountable owner understands impact, alternatives, and monitoring coverage.

## Common failure patterns
Stopping at 'user sent a jailbreak', blaming an operator, writing vague actions such as 'monitor better', ignoring near-miss potential impact, and closing remediation without testing it.

## Verification
Implemented means review actions were assigned. Verified means corrective controls were tested against the incident scenario, monitoring was updated, and repeat-event risk was reassessed.

## Expected output
Incident review with timeline, impact, root causes, contributing factors, control gaps, remediation, owners, verification criteria, and residual risk.

## Stop conditions
Escalate when facts remain materially disputed, legal privilege is required, affected customers or regulators may need formal communication, or remediation requires risk acceptance above the team's authority.