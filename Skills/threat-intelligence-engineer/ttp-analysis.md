# TTP Analysis

## Purpose
Analyze adversary tactics, techniques, and procedures to produce durable defensive understanding beyond ephemeral indicators.

## When to use
Use during campaign analysis, detection engineering support, threat hunting, or control-gap assessment.

## Inputs
Incident evidence, malware behavior, logs, reports, ATT&CK mappings, detection coverage.

## Context to inspect
Inspect observed behaviors, affected platforms, execution sequence, privileges, persistence, lateral movement, command-and-control, and objectives.

## Core knowledge
A technique mapping is a hypothesis supported by behavior, not a label copied from a report. Procedure-level detail and evidence make mappings operationally useful.

## Procedure
1. Build an evidence-backed event sequence.
2. Describe behavior in platform-neutral terms.
3. Map behaviors to ATT&CK tactics and techniques at the narrowest justified level.
4. Record procedure examples and evidence references.
5. Identify prerequisites and observable telemetry.
6. Compare against current detections and controls.
7. Prioritize gaps by relevance and impact.
8. Feed durable behaviors to hunters and detection engineers.

## Decision points
Use sub-techniques only when evidence supports specificity. Prefer behavior-based controls over IOC-only controls when infrastructure changes frequently.

## Common failure patterns
Overmapping, copying vendor ATT&CK labels, confusing tools with techniques, ignoring sequence, and treating unobserved techniques as confirmed.

## Verification
A peer can trace every mapping to evidence and defenders can identify concrete telemetry or controls for prioritized techniques.

## Expected output
Evidence-backed TTP map with procedures, confidence, telemetry, and defensive implications.

## Stop conditions
Stop asserting a mapping when evidence is ambiguous; record alternatives and confidence instead.