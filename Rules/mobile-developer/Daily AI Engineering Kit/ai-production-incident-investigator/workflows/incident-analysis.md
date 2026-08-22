# Workflow: Incident Analysis

## Trigger
Production incident or unexplained failure.

## Stages
1. Collect context.
2. Gather evidence.
3. Create hypotheses.
4. Validate hypotheses.
5. Review findings.
6. Produce incident report.

## Retry Policy
Maximum 2 retries for transient tool failures.
Preserve collected evidence.
Escalate after repeated failures.

## Approval Points
Any production modification requires explicit approval.

## Done
Evidence-backed cause, verification status, and remaining risks recorded.
