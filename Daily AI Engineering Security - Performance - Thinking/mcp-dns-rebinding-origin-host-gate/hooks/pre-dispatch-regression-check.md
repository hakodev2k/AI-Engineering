# Hook: Pre-Dispatch Regression Check

## Trigger
Before deployment, release, or merge of MCP HTTP transport/proxy changes.

## Preconditions
Run from the package root with Python 3.10+.

## Action
Execute:

```bash
python -m unittest tests/test_origin_host_gate.py
```

For production integration, run equivalent framework-level tests proving the middleware/gate executes before MCP dispatch.

## Expected result
All tests pass; hostile host/origin/forwarded-header/bind fixtures are denied and approved native-client fixture is allowed.

## Failure behavior
Block completion/deployment. Preserve output and identify the failing policy invariant. Do not change an allowlist to `*` or enable untrusted forwarded headers to obtain a pass.

## Blocking
Yes.
