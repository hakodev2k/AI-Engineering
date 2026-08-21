# PR Review Workflow

## Trigger
Pull request opened or updated.

## Stages
1. Gather repository context.
2. Run deterministic checks.
3. Execute review agents.
4. Consolidate findings.
5. Require human decision for changes.
6. Verify resolution.

## Retry Policy
Maximum 2 retries for transient tool failures only.

## Stop Conditions
- Missing repository context
- Permission failure
- Conflicting requirements

## Definition of Done
Review evidence exists and verification status is recorded.
