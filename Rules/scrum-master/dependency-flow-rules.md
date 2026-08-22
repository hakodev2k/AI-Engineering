# Dependency and Flow Rules

## Purpose
Reduce avoidable waiting, coordination cost, and cross-team delivery risk.

## MUST
- Make material dependencies, queues, blocked work, and ownership visible.
- Facilitate removal or redesign of recurring dependencies where economically justified.
- Escalate systemic flow constraints with evidence of impact.

## MUST NOT
- Optimize local utilization while ignoring increased end-to-end delay.
- Hide external waiting time inside team estimates.

## SHOULD
Favor smaller batches, fewer handoffs, and explicit service expectations when they improve flow.

## Exceptions
Necessary specialist or compliance dependencies may remain when risk and service expectations are explicit.

## Verification
Inspect cycle time, blocked time, dependency recurrence, queue age, and improvement experiments.