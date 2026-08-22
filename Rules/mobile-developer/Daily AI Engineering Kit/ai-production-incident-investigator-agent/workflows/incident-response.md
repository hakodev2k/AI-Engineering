# Workflow: Incident Response

## Flow
Trigger -> Context -> Plan -> Investigation -> Review -> Verification

## Stages
1. Collect incident context.
2. Validate available evidence.
3. Assign analysis agents.
4. Generate hypotheses.
5. Verify findings.
6. Produce report.

## Retry Policy
Maximum 3 retries for transient tool failures.

Retryable: unavailable logs, temporary API failure.

Stop: missing permissions, unsafe actions, repeated evidence conflicts.

## Approval Points
Human approval required before remediation execution.

## Done
Verified evidence-backed report exists.
