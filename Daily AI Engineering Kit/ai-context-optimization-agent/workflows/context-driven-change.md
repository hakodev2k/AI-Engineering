# Context Driven Change Workflow

## Trigger
Feature, bug fix or review task requiring AI assistance.

## Stages
1. Repository Explorer maps structure.
2. Planner identifies required evidence.
3. Implementation agent works only with approved context.
4. Verification agent checks build, tests and diff.

## Retry
Maximum 2 retries for transient tool failures.
Preserve evidence after every failure.

## Approval
Required for production changes, destructive operations and API breaking changes.
