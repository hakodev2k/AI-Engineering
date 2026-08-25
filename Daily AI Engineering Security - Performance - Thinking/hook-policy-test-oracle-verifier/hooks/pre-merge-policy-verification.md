# Hook: Pre-Merge Policy Verification

## Trigger
Before merging a change to permission hooks, permission configuration, host adapters, or agent/runtime versions that affect authorization behavior.

## Preconditions
A reviewed case matrix exists; the hook executable is trusted local code; destructive cases have harmless canaries; runtime identity/version/mode are recorded.

## Action
1. Run isolated hook verification:
```bash
python scripts/verify_hook_policy.py --cases "$CASES" --hook "$HOOK"
```
2. Run the host-specific sandbox/canary suite and emit effective observations as JSONL.
3. Verify runtime observations:
```bash
python scripts/verify_hook_policy.py --cases "$CASES" --observed-jsonl "$OBSERVED"
```
4. Run package tests.

## Expected result
All commands return exit 0, every required case is observed, and false-allow count is zero.

## Failure behavior
Any mismatch, timeout, parser error, or missing observation blocks completion. Preserve the failing case and effective runtime metadata. One diagnostic rerun maximum.

## Blocks completion
Yes. A hook-unit pass alone does not satisfy this gate for a security-critical control.
