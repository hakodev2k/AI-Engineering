# Hook: Pre-Open Security Gate

## Trigger
Immediately after repository acquisition/change and before launching an editor or coding agent.

## Preconditions
Repository path exists and has not been activated by the target product.

## Action
Run the static scanner:
```bash
python scripts/scan_repository_open_risk.py "$REPO_PATH" --approval-file "$APPROVAL_FILE"
```
Omit `--approval-file` when no approvals exist.

## Expected result
Exit `0`: activation may proceed. Exit `2`: unapproved risky startup configuration exists. Exit `1`: scanner/input failure.

## Failure behavior
Any non-zero exit blocks workspace activation. Persist scanner output for review. Do not auto-approve.

## Blocking
Yes. Failure blocks completion because the purpose of the hook is to ensure trust is established before repository-controlled startup execution.