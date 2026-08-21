# Postmortem Rules

## Purpose
Convert significant incidents into durable organizational learning and measurable reliability improvements.

## Scope
Applies to post-incident reviews for outages, severe degradation, near misses, data-risk events, and recurring operational failures.

## MUST
- Significant incidents MUST receive a postmortem when learning or systemic remediation is warranted.
- Postmortems MUST separate observed facts, contributing conditions, and hypotheses.
- Root-cause statements MUST be supported by evidence and MUST avoid reducing complex failures to individual blame.
- Action items MUST have owners, expected outcomes, and tracking to completion.
- Repeated incident patterns MUST trigger broader systemic review rather than isolated fixes.

## MUST NOT
- MUST NOT invent certainty where evidence is incomplete.
- MUST NOT close a postmortem with vague actions such as 'be more careful'.
- MUST NOT hide organizational, process, tooling, or architecture contributors because a human error occurred.

## SHOULD
- Capture detection gaps, response gaps, recovery friction, and what worked well.
- Share reusable lessons with teams operating similar systems.

## Exceptions
Sensitive details may be restricted, but operational lessons and required remediation SHOULD still be preserved for authorized stakeholders.

## Verification
Review incident evidence, timeline consistency, action-item quality, completion tracking, recurrence rates, and follow-up changes.