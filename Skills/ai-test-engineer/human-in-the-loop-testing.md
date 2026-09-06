# Human-in-the-Loop Testing

## Purpose
Validate workflows where people review, approve, correct, override, or supervise AI outputs so the combined human-AI system achieves the intended safety and quality outcome.

## When to use
Use for approval queues, expert review, escalation workflows, copilots, high-stakes recommendations, and agent confirmation gates.

## Inputs
Workflow, reviewer roles, AI outputs, escalation rules, UI, time constraints, quality criteria, and representative cases.

## Preconditions
Human responsibilities and decision authority are explicitly defined.

## Context to inspect
Inspect review UI, confidence indicators, explanations, queueing, audit logs, override controls, time pressure, training materials, and automation defaults.

## Core knowledge
Adding a human does not automatically make a system safe. Reviewers can over-trust automation, rubber-stamp under load, miss hidden context, or be unable to detect model errors. Test the sociotechnical workflow, not only the AI output.

## Procedure
1. Define which decisions require human review and why.
2. Create cases with obvious, subtle, and high-impact AI errors.
3. Test whether reviewers can detect and correct those errors.
4. Measure review accuracy, time, override rate, and escalation behavior.
5. Test workload and queue-pressure effects.
6. Verify the UI exposes evidence needed for judgment without misleading confidence cues.
7. Test disagreement and second-review paths.
8. Confirm overrides are captured and auditable.
9. Inspect whether reviewer corrections feed appropriate learning or regression processes.
10. Re-test after UI, policy, or model changes.

## Decision points
Require human review where impact is high and automated reliability is insufficient, but do not use review as a substitute for fixing systematic model failures. Escalate uncertain specialist decisions to qualified domain experts.

## Common failure patterns
Nominal approval gates with no useful context, reviewer automation bias, unrealistic test workloads, hidden time pressure, and no audit trail for overrides.

## Verification
Confirm representative reviewers can detect protected failure classes at required rates and the workflow preserves accountable decisions under realistic load.

## Expected output
A human-oversight evaluation with reviewer performance, workflow bottlenecks, missed-error patterns, and control recommendations.

## Stop conditions
Stop when reviewers lack required qualifications, test scenarios could cause real-world harm, or decision ownership is unclear.