# Hook: Final Verification

## Trigger
After remediation, before verified-successful status.

## Action
1. Re-run scanner on final changed files.
2. Expand to affected subtree for dynamic wiring.
3. Run relevant build/unit/integration/static checks.
4. Inspect final diff for test imports, loopback endpoints, fixture credentials, environment switches, or broad exclusions.
5. Independent verifier traces production composition/configuration to resolved implementation.

## Expected result
Zero unexcepted blockers; relevant checks pass; production resolution is production-capable; tests remain isolated.

## Failure behavior
Return evidence to remediation if retry budget remains; otherwise escalate.

## Blocking
Yes.