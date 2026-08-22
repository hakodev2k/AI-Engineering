# PR Review Workflow

## Trigger
New pull request or significant update.

## Stages
1. Collect repository context.
2. Analyze changed files.
3. Run risk reviewers.
4. Execute deterministic checks.
5. Generate review report.

## Retry Policy
Maximum 2 retries for transient tool failures.
Preserve collected evidence.
Escalate after repeated failure.

## Approval Points
Required for production, schema, security, and breaking API changes.

## Done
Evidence-backed review completed.
