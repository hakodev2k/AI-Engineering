# Confidence and Uncertainty Routing

## Purpose
Use calibrated uncertainty signals to decide whether to accept a model result, escalate, retry with another model, or request human review.

## When to use
Use when error cost is uneven and routing decisions depend on confidence rather than task identity alone.

## Inputs
Model outputs, confidence proxies, validation signals, labeled evaluation data, acceptable-risk thresholds.

## Context to inspect
Task-specific correctness criteria, model calibration history, parser/validator failures, disagreement patterns, and human-review capacity.

## Core knowledge
LLM self-reported confidence is often poorly calibrated. Strong signals include external validators, ensemble disagreement, retrieval support, constrained decoding failures, and task-specific checks. Calibration must be measured per domain and version.

## Procedure
1. Define the error event uncertainty should predict.
2. Collect candidate uncertainty features.
3. Measure calibration and discrimination on held-out data.
4. Convert signals into risk bands.
5. Map each band to accept, escalate, abstain, or human-review actions.
6. Apply hard policy constraints before uncertainty routing.
7. Recalibrate after model, prompt, or domain changes.
8. Monitor drift in confidence-versus-error relationships.

## Decision points
Use abstention when no eligible model can meet required confidence. Prefer external verification to model self-assessment for high-impact decisions.

## Common failure patterns
Treating confidence as probability of correctness, using one threshold for all tasks, calibrating on training data, and ignoring distribution shift.

## Verification
Verify reliability diagrams or equivalent calibration evidence, escalation performance, false-accept rates for critical errors, and stability by traffic segment.

## Expected output
A calibrated uncertainty policy with signal definitions, thresholds, actions, and monitoring requirements.

## Stop conditions
Stop when no available signal meaningfully predicts error or when required error labels are unavailable.