# AI Error Recovery and Resilience

## Purpose
Research how users detect, understand, contain, correct, and recover from AI failures, including failures that emerge across multiple interaction turns or autonomous actions.

## When to use
Use when an AI can hallucinate, misinterpret intent, execute incorrect actions, lose context, produce unsafe output, or fail partially.

## Inputs
Known failure modes, interaction flow, permissions, task stakes, recovery mechanisms, logs, and target users.

## Context to inspect
Review model and tool errors, undo behavior, checkpoints, history, provenance, escalation, user permissions, side effects, and existing incident data.

## Core knowledge
Failure recovery is part of usability and safety. Detection, diagnosis, containment, correction, and restoration are distinct stages. Automation can increase recovery cost when actions propagate before users notice them.

## Procedure
1. Build a taxonomy of representative failures from evaluations and production evidence.
2. Rank failures by severity, detectability, frequency, reversibility, and propagation risk.
3. Create realistic scenarios without unnecessarily endangering real data.
4. Observe whether users notice the failure and what cues trigger detection.
5. Record diagnostic strategies and mistaken interpretations.
6. Measure ability to stop propagation or revoke actions.
7. Evaluate undo, retry, edit, regenerate, restore, and escalation mechanisms.
8. Measure time, effort, residual damage, and confidence after recovery.
9. Test compound failures and degraded dependencies where relevant.
10. Recommend changes to prevention, observability, containment, and recovery.

## Decision points
Prefer prevention for severe irreversible failures; graceful recovery for unavoidable low-risk errors; checkpoints for multi-step actions; human approval before high-impact side effects.

## Common failure patterns
Testing only obvious errors, offering retry as the only recovery, hiding partial completion, destructive retries, losing prior user work, and assuming users know whether an error came from the model, tool, data, or network.

## Verification
Demonstrate successful recovery from representative failures and verify that recovery does not introduce duplicate actions, data loss, or hidden side effects.

## Expected output
A recovery assessment with failure taxonomy, detection gaps, containment and recovery performance, residual risks, and prioritized mitigations.

## Stop conditions
Stop when testing would cause irreversible production effects, required audit evidence is unavailable, or severe failures lack an authorized containment path.