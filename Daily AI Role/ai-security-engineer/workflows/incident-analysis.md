# Security Incident Analysis Workflow

## Trigger

There is a credible signal of compromise, sensitive-data exposure, unsafe AI/tool behavior, control bypass, malicious input propagation, or other security-relevant event.

## Stages

1. Confirm authorization, incident owner, scope, communication channel, and evidence-preservation rules.
2. Establish timeline, affected assets/users/data, identities, model/tool/retrieval paths, and current impact.
3. Preserve volatile evidence and record collection source/time without copying secret values into reports.
4. Separate observed facts, hypotheses, unknowns, and containment options.
5. Support the authorized owner with impact-aware containment; do not mutate production independently.
6. Test hypotheses against logs, configuration, code, and controlled reproduction evidence.
7. Identify cause, contributing controls, persistence/re-entry paths, and affected scope.
8. Define remediation and verification, including credential/session/data handling where authorized.
9. Verify containment and recovery with fresh evidence.
10. Handoff residual risk, disclosure/notification decisions, owners, and prevention actions.

## Parallel work and synchronization

Timeline reconstruction, identity review, component analysis, and exposure assessment may run in parallel with separate evidence owners. Synchronize before containment changes, external communication, severity changes, and closure. The Incident Commander owns incident coordination; this role owns security analysis within scope.

## Stop and escalation conditions

Stop and escalate when scope or authorization is unclear, evidence collection could destroy data, regulated/personal data requires special handling, active exploitation risks broader harm, or a requested action crosses approval boundaries.

## Completion

Facts and timeline are evidence-backed; affected scope and residual uncertainty are explicit; authorized containment/remediation is verified; suspected secret values remain redacted; required notifications/approvals have owners; and prevention work has accountable follow-up.
