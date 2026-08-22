# Incident Command

## Purpose
Coordinate high-severity production incidents with clear authority, roles, communication, evidence preservation, and safe decision-making.

## When to use
Use when user impact is material, multiple responders are involved, diagnosis is uncertain, or recovery requires coordinated actions across systems or teams.

## Inputs
Alerts, incident symptoms, telemetry, recent changes, service ownership, escalation paths, and communication channels.

## Context to inspect
Inspect current impact, affected regions or tenants, active deployments, dependency status, known runbooks, previous incidents, and available responders.

## Core knowledge
Incident command separates coordination from technical investigation. The incident commander owns priorities and decisions, not necessarily diagnosis. Stabilization takes precedence over root-cause certainty. Maintain a timeline and avoid uncontrolled parallel changes.

## Procedure
1. Declare severity and establish an incident channel.
2. Assign incident commander, operations lead, communications lead, and specialists as needed.
3. State current impact and immediate objective.
4. Freeze unrelated risky changes.
5. Create and maintain a timestamped event timeline.
6. Form hypotheses from evidence and assign investigations explicitly.
7. Prefer reversible mitigation before complex repair.
8. Communicate status at predictable intervals.
9. Validate recovery with user-facing signals, not only component health.
10. Define monitoring period and handoff before closing.

## Decision points
Rollback when a recent change is plausibly causal and rollback risk is lower than continued impact. Fail over when the alternate path is tested and state consequences are understood. Escalate early when authority, expertise, or access is missing.

## Common failure patterns
Everyone debugging without coordination, multiple simultaneous mitigations, premature root-cause claims, silent long-running investigations, unsafe production experimentation, and declaring recovery from a single green dashboard.

## Verification
Confirm impact metrics recover, representative user journeys succeed, queues and backlogs normalize, no hidden regional impact remains, and the incident timeline captures major decisions.

## Expected output
Controlled incident response, current status, decision log, mitigation evidence, recovery validation, and follow-up actions.

## Stop conditions
Stop risky actions when blast radius is unknown, required approvals are absent, evidence contradicts the current hypothesis, or mitigation could worsen data integrity.