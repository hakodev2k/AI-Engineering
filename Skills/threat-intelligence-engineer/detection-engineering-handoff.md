# Detection Engineering Handoff

## Purpose
Translate intelligence into precise, testable detection requirements that detection engineers can implement and maintain.

## When to use
Use when campaign, malware, infrastructure, or TTP analysis reveals a durable detection opportunity.

## Inputs
Evidence, TTP mappings, procedure details, telemetry, known-good patterns, sample events, severity and threat relevance.

## Context to inspect
Review existing detections, schemas, telemetry quality, expected event volume, suppression logic, and response workflow.

## Core knowledge
Intelligence describes adversary behavior; detection engineering encodes observable evidence. A useful handoff states what is stable, what varies, and what false positives to expect.

## Procedure
1. Define the adversary behavior and defensive objective.
2. Identify observable telemetry fields and prerequisites.
3. Provide positive examples and nearby benign cases.
4. Separate invariant features from campaign-specific indicators.
5. Specify scope, severity, and expected prevalence.
6. Suggest logic without overprescribing platform syntax.
7. Document evasion paths and blind spots.
8. Validate with detection engineers.
9. Test against representative data.
10. Track resulting coverage.

## Decision points
Use signatures for stable artifacts, analytics for behavioral patterns, and correlation when single events are weak.

## Common failure patterns
IOC dumps presented as detections, no benign examples, impossible telemetry assumptions, overly broad ATT&CK mappings, and no lifecycle owner.

## Verification
The implemented detection fires on representative malicious behavior, acceptable benign data is measured, and limitations match the intelligence handoff.

## Expected output
Detection requirement with behavior, telemetry, examples, scope, false-positive considerations, evasion notes, and references.

## Stop conditions
Stop when required telemetry does not exist or evidence is too weak to define a defensible detection objective.