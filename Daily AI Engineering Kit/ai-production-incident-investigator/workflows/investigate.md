# Investigation Workflow

Trigger: Production incident.

Stages:
1. Collect context.
2. Create timeline.
3. Analyze evidence.
4. Generate hypotheses.
5. Validate hypotheses.
6. Prepare remediation.
7. Verify outcome.

Retry policy:
- Maximum retries: 2
- Retry only transient tool failures.
- Preserve previous evidence.
- Escalate after repeated failure.

Approval points:
- Any production change
- Any destructive operation

Done when evidence, findings, and verification are recorded.
