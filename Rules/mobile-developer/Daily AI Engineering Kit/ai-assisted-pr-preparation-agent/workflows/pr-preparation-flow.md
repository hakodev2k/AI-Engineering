# PR Preparation Workflow

## Trigger
New feature branch or pull request creation.

## Stages
1. Collect repository context.
2. Analyze changes.
3. Run deterministic validation.
4. Generate summary and risk report.
5. Request human review.

## Retry Policy
Maximum 2 retries for transient tool failures.
Preserve logs and stop on repeated failures.

## Definition of Done
- Evidence collected.
- Verification completed.
- Risks documented.
- Human reviewer can understand the change.
