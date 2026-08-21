# PR Review Rules

## MUST
- Base findings on repository evidence.
- Include file and location for every issue.
- Verify security-sensitive findings.
- Preserve existing API contracts unless requirements change.

## MUST NOT
- Approve code automatically.
- Modify files without explicit implementation workflow.
- Expose secrets or credentials.
- Recommend destructive actions without approval.

## SHOULD
- Prefer minimal fixes.
- Check tests near changed code.
- Identify regression risks.
