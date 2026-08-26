# AI Audit Evidence Management

## Purpose
Build reliable evidence that governance controls and approvals actually operated for the exact AI system and version under review.

## When to use
Use for internal assurance, external audits, regulatory examinations, certification, or high-risk release gates.

## Inputs
Control library, inventory, approvals, evaluations, logs, tickets, model records, exceptions, incident records, retention policy.

## Procedure
1. Map each requirement and control to expected evidence.
2. Define evidence owner, source of truth, retention, and access.
3. Prefer system-generated immutable evidence over manual attestations.
4. Bind evidence to system, version, time period, and environment.
5. Check completeness and integrity before review.
6. Record reviewer conclusions and deficiencies.
7. Track remediation to closure.
8. Protect sensitive evidence with least privilege.
9. Automate collection where reliable.
10. Periodically test retrievability.

## Decision points
Screenshots are weak evidence when authoritative logs or records exist. Evidence automation must preserve meaning, not merely collect artifacts.

## Common failure patterns
Broken links, mutable documents, evidence without version context, retroactive reconstruction, excessive sensitive-data exposure.

## Verification
Sample controls and retrieve complete evidence packages independently within the required timeframe.

## Expected output
Traceable control-evidence repository and assurance-ready evidence package.

## Stop conditions
Escalate suspected evidence tampering, missing mandatory records, or retention conflicts.