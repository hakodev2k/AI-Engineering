# Network Incident Response and Root Cause Analysis

## Purpose
Restore network service quickly while preserving evidence and producing defensible root cause and prevention actions.

## When to use
Use for material outages, severe degradation, security-related network events, repeated incidents, or complex multi-team failures.

## Inputs
Incident timeline, alerts, topology, configurations, changes, logs, metrics, flow data, packet evidence, affected services, and stakeholder reports.

## Context to inspect
Inspect recent changes, dependency health, redundant paths, provider status, routing/policy state, DNS, capacity, device health, and previous similar incidents.

## Core knowledge
Incident response separates mitigation from root-cause proof. Senior engineers manage blast radius, communicate uncertainty, preserve evidence, and avoid risky speculative changes.

## Procedure
1. Establish incident scope, severity, and command ownership.
2. Protect safety and preserve evidence.
3. Build a timestamped symptom/change timeline.
4. Map affected and unaffected paths.
5. Apply the lowest-risk mitigation that restores service.
6. Verify recovery from user/service perspective.
7. Reconstruct causal chain using telemetry and configuration evidence.
8. Distinguish trigger, contributing conditions, and root causes.
9. Define prevention, detection, and recovery improvements.
10. Assign owners and verify follow-through.

## Decision points
Fail over when expected recovery is faster and safer than in-place repair. Roll back recent changes when evidence and timing support it, but do not assume correlation proves causation.

## Common failure patterns
Changing many things at once, premature root-cause claims, deleting evidence by rebooting, weak communication, focusing on blame, and action items that merely say “be careful.”

## Verification
Confirm service restoration, causal evidence, reproduction or strong corroboration, and measurable remediation actions with owners.

## Expected output
An incident record with impact, timeline, mitigation, evidence-backed root cause, contributing factors, and preventive actions.

## Stop conditions
Escalate when incident authority is unclear, security compromise is suspected, provider action is required, or remediation exceeds approved risk.