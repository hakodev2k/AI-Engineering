# Pull Request Review Workflow

## Trigger
New or updated pull request.

## Stages
1. Collect repository context and diff.
2. Analyze changed code.
3. Review security and architecture risks.
4. Run available verification commands.
5. Produce findings.
6. Require human decision.

## Retry Policy
Maximum 2 retries for transient tool failures only.

## Approval
Human approval required before merge.

## Definition of Done
- Findings are evidence-based.
- Verification status is recorded.
- No unresolved critical risk remains.
