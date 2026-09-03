# Hook: Pre-deploy MCP Exposure Gate

## Trigger
Immediately before deployment, container publishing, ingress activation, or remote-transport enablement.

## Preconditions
Effective policy JSON has been generated from the deployment being released.

## Action
Run:

```bash
python scripts/listener_policy_check.py config/policy.example.json --json
python -m unittest tests/test_listener_policy_check.py
```

For real deployments, replace the example policy path with the generated effective policy snapshot.

## Expected result
Policy checker exits 0 with `PASS`; unit tests exit 0; safe environment-specific unauthorized probe is rejected before MCP tool dispatch.

## Failure behavior
Block completion/deployment and emit only violation metadata. Do not print credentials or request authorization headers.

## Blocking
Yes. A non-zero policy or test result blocks release.
