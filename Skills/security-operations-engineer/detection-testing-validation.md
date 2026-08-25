# Detection Testing and Validation

## Purpose
Prove that security detections actually observe intended behavior end-to-end and remain effective as systems change.

## When to use
Use before deploying detections, after telemetry/parser changes, during purple-team exercises and for periodic coverage assurance.

## Inputs
Detection logic, expected behavior, test environment, telemetry path, representative benign data and response routing.

## Context to inspect
Confirm test safety, production similarity, rule schedule, ingestion latency, suppression and enrichment dependencies.

## Core knowledge
Query syntax success is not detection validation. End-to-end validation includes event generation, ingestion, parsing, rule execution, alert creation, enrichment and routing.

## Procedure
1. Define positive and negative test cases.
2. Identify safe behavior simulation method.
3. Record expected observable events.
4. Generate or replay controlled telemetry.
5. Verify raw events arrive intact.
6. Verify normalization and entity mapping.
7. Confirm rule fires within expected latency.
8. Validate severity, enrichment and routing.
9. Test known benign cases and exclusions.
10. Record test evidence and automate regression tests where feasible.
11. Repeat after material dependency changes.

## Decision points
Use replay when live simulation is risky; use controlled adversary emulation when execution context is essential. Never weaken production controls merely to make a test pass.

## Common failure patterns
Testing only the query editor; synthetic fields unlike production; no negative tests; ignoring rule schedule; stale test fixtures.

## Verification
Evidence shows the complete pipeline worked and expected non-malicious cases did not create unacceptable noise.

## Expected output
Versioned validation cases, results, latency and identified gaps.

## Stop conditions
Stop if simulation could cause production harm, violate policy or contaminate regulated evidence.