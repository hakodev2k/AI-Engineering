# Human Oversight Design

## Purpose
Design meaningful human oversight for AI-assisted or automated decisions rather than nominal human-in-the-loop controls.

## When to use
Use for consequential decisions, autonomous actions, safety-sensitive workflows, or policies requiring human review.

## Inputs
Decision workflow, user roles, model outputs, confidence/uncertainty signals, failure modes, time constraints, appeal process, workload.

## Procedure
1. Identify decisions requiring human authority.
2. Define what information reviewers receive and when.
3. Assess whether reviewers have competence, time, independence, and authority to disagree.
4. Design escalation and fallback paths.
5. Mitigate automation bias with interface and process controls.
6. Define override, abstention, and shutdown mechanisms.
7. Capture rationale for consequential overrides/acceptances where appropriate.
8. Train reviewers on limitations and failure patterns.
9. Measure override behavior, review quality, and workload.
10. Recalibrate oversight when model performance or workflow changes.

## Decision points
Use pre-action review when errors are hard to reverse; post-action sampling may suffice for low-impact reversible actions.

## Common failure patterns
Rubber-stamping, excessive reviewer workload, hidden uncertainty, no authority to override, no fallback process.

## Verification
Scenario tests demonstrate humans can detect, reject, escalate, and recover from representative AI failures.

## Expected output
Oversight workflow, role requirements, decision criteria, escalation paths, training, and effectiveness metrics.

## Stop conditions
Escalate when meaningful oversight is operationally impossible for a high-impact use.