# Hook: Preflight HTTP Boundary

## Trigger
Before release/deployment of an MCP HTTP endpoint or after transport/proxy/auth configuration changes.

## Preconditions
`config/policy.json` is reviewed and the Python standard library is available.

## Action
Run:

```bash
python scripts/mcp_boundary_probe.py --policy config/policy.json --cases tests/cases.json
python -m unittest tests/test_mcp_boundary_probe.py
```

For an owned endpoint, additionally run the project's integration tests that prove rejection happens before MCP dispatch.

## Expected result
All fixture expectations match the policy oracle and unit tests exit 0. Deployment evidence confirms the effective boundary matches the oracle.

## Failure behavior
Block Verified status and deployment when this hook is a release gate. Capture the failed case and responsible layer.

## Blocks completion
Yes for security-sensitive releases; no control may be disabled merely to get a pass.
