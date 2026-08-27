# Recovery Postmortem and Continuous Improvement

## Purpose
Convert recovery incidents and exercises into durable improvements in architecture, runbooks, automation, monitoring, and organizational readiness.

## When to use
Use after material restores, DR exercises, RTO/RPO misses, backup failures, or near misses.

## Inputs
Incident timeline, telemetry, decision logs, restore evidence, objective targets, operator notes, and stakeholder feedback.

## Context to inspect
Inspect what actually happened rather than relying on recollection. Include detection delays, approval delays, throughput constraints, validation failures, and hidden dependencies.

## Core knowledge
A useful postmortem separates contributing conditions from individual blame and turns observations into owned corrective actions. Recovery metrics should measure capability, not merely job completion.

## Procedure
1. Build an evidence-based timeline.
2. Compare observed RTO/RPO with targets.
3. Identify technical, procedural, and organizational contributors.
4. Distinguish root causes from symptoms.
5. Identify controls that failed to detect or contain the issue.
6. Prioritize actions by risk reduction and recurrence likelihood.
7. Assign owners and due dates.
8. Update runbooks, architecture, monitoring, and training.
9. Define re-test criteria for material fixes.
10. Track actions to closure and verify effectiveness.

## Decision points
Prefer systemic fixes over adding manual checklist steps when automation or architecture can eliminate the failure mode. Accept residual risk explicitly when remediation cost is disproportionate.

## Common failure patterns
Blame-focused reviews; vague actions such as 'be careful'; no owners; closing actions without re-test; ignoring business decision delays in RTO.

## Verification
Confirm material remediation through a targeted recovery test and demonstrate the prior failure mode is prevented or detected earlier.

## Expected output
A concise postmortem with evidence, prioritized corrective actions, and verified follow-through.

## Stop conditions
Escalate when evidence is insufficient for conclusions, security/legal review restricts disclosure, or accepted residual risk requires executive ownership.