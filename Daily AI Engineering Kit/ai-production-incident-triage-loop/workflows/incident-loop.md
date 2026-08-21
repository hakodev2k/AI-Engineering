# Incident Workflow

Trigger: production incident alert.

Stages:
1. Collect context.
2. Build timeline.
3. Generate hypotheses.
4. Investigate.
5. Propose mitigation.
6. Verify.
7. Close.

Retry policy:
- maximum retries: 3
- retry only transient tool failures
- preserve evidence
- escalate after limit

Approval:
production changes require human approval.

Definition of Done:
- evidence stored
- root cause confidence recorded
- verification passed
