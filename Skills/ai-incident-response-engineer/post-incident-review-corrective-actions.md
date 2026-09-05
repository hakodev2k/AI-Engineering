# Post-Incident Review and Corrective Actions

## Purpose
Convert incident learning into prioritized engineering, safety, operational, and process improvements.

## When to use
Use after material incidents once facts and root causes are stable.

## Inputs
Incident timeline, impact, RCA, response actions, detection performance, stakeholder feedback, existing backlog.

## Preconditions
Review is blameless and has accountable owners for follow-up.

## Context to inspect
Previous similar incidents, open risks, architecture decisions, test/evaluation gaps, SLOs, runbooks, ownership.

## Core knowledge
Corrective actions should reduce recurrence probability, blast radius, or time-to-detection/recovery. Vague actions such as “monitor better” are not sufficient.

## Procedure
1. Summarize impact and duration.
2. Identify what worked and failed in detection, containment, diagnosis, and communication.
3. Review causal factors.
4. Generate preventive, detective, and containment improvements.
5. Prioritize by risk reduction and effort.
6. Define measurable completion criteria.
7. Assign owners and due dates.
8. Add regression evaluations and runbook changes.
9. Track actions to closure.
10. Revisit high-risk actions after implementation.

## Decision points
Prioritize systemic controls over one-off patches and high-leverage guardrails over cosmetic fixes.

## Common failure patterns
No owners, vague actions, only fixing the trigger, skipping monitoring gaps, and closing review before actions enter normal planning.

## Verification
Each action has an owner, measurable outcome, and traceability to a causal or response gap.

## Expected output
A concise PIR and risk-ranked corrective-action register.

## Stop conditions
Escalate unresolved high-risk actions that cannot be funded or owned.