# PR Review Workflow

## Trigger
Pull request created or updated.

## Stages
1. Collect repository context.
2. Analyze changed files.
3. Run specialist review checks.
4. Generate findings.
5. Validate findings.
6. Publish review result.

## Retry Policy
- Maximum retries: 2
- Retry only transient tool failures.
- Preserve collected evidence.
- Stop after repeated validation failures.

## Approval Points
Human approval required before merge or applying risky fixes.

## Done
Review output is complete and all findings have evidence.
