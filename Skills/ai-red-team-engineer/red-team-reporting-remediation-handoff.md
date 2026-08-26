# Red-Team Reporting and Remediation Handoff

## Purpose
Communicate AI security findings so engineering, product, safety, and operations teams can reproduce, prioritize, fix, and verify them.

## When to use
Use after validating a finding or completing a red-team campaign.

## Inputs
Evidence, reproduction steps, severity, root cause, affected versions, proposed mitigations, test artifacts, and ownership information.

## Context to inspect
Confirm audience, confidentiality, disclosure constraints, issue-tracking workflow, release timing, and incident obligations.

## Core knowledge
High-quality findings separate observation, exploit path, impact, assumptions, and remediation. AI findings require model/configuration metadata and stochastic reproduction rates. Sensitive exploit details should be access-controlled.

## Procedure
1. State the violated security invariant in one sentence.
2. Record affected system/model versions and environment.
3. Provide minimal safe reproduction steps.
4. Attach representative evidence and observed frequency.
5. Explain attacker prerequisites and credible impact.
6. Describe root cause with confidence level.
7. Recommend controls at the correct architectural layer.
8. Define verification and regression criteria.
9. Assign owner, priority, and target milestone.
10. Track residual risk and closure evidence.

## Decision points
Use an incident channel rather than normal backlog flow for active critical exposure. Limit exploit detail when broad distribution would increase risk.

## Common failure patterns
Sensational titles; raw transcripts without analysis; missing versions; vague remediation like 'improve prompt'; severity without prerequisites; closure without retest.

## Verification
A receiving engineer should be able to reproduce the issue from the report, understand the invariant, implement a targeted fix, and know exactly how closure will be tested.

## Expected output
A concise, evidence-rich finding or campaign report with actionable remediation handoff.

## Stop conditions
Escalate immediately when a finding indicates ongoing compromise, legal/privacy notification duties, or imminent high-impact abuse.