# Hook: Preflight Authorization Boundary

## Trigger
Before an MCP HTTP/SSE service is exposed, restarted after security-relevant configuration changes, or promoted to an environment where it can reach privileged backends.

## Preconditions
A sanitized deployment JSON exists with bind address, external reachability, inbound auth mode, caller identities, enabled tools, mutating tools, and backend credential metadata.

## Action
Run:

```bash
python3 scripts/verify_mcp_auth_boundary.py deployment.json
```

## Expected result
Exit code 0 and a JSON result with `status: "pass"`, zero blocking findings, and explicit metrics.

## Failure behavior
Exit code 2 blocks deployment/promotion. Exit code 1 indicates malformed input and also blocks completion. Preserve the sanitized result as evidence and route the failed invariant to the implementation owner.

## Blocking
Yes. The hook MUST NOT be bypassed for a privileged listener. Any emergency exception requires explicit human approval, time-bounded isolation controls, and a documented rollback/remediation owner.
