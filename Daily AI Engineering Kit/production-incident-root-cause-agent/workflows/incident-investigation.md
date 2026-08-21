# Incident Investigation Workflow

Trigger: production incident or reliability alert.

Stages:
1. Collect context.
2. Build timeline.
3. Create hypotheses.
4. Validate each hypothesis.
5. Prepare remediation proposal.
6. Verify resolution.

Retry policy:
- Maximum retries: 3
- Retry only transient tool failures.
- Preserve evidence before retry.

Stop conditions:
- Missing critical evidence.
- Approval required action detected.