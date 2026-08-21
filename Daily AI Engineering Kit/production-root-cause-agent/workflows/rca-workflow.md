# RCA Workflow

## Trigger
Production incident detected.

## Stages
1. Collect evidence.
2. Build timeline.
3. Analyze hypotheses.
4. Validate with repository and operational data.
5. Produce RCA report.

## Retry Policy
Maximum 2 retries for transient collection failures.
Preserve evidence after every attempt.

## Approval Points
Human approval required before remediation actions.

## Done
RCA contains impact, timeline, evidence, root cause, and verification.
