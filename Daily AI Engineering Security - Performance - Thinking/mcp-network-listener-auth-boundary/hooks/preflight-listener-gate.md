# Hook: Preflight Listener Gate

## Trigger
Before starting or deploying a network MCP transport.

## Preconditions
Python 3.10+ and `config/policy.json` are available from the package root.

## Action
Run the deterministic policy test suite, then validate the intended bind/auth configuration:

```bash
python -m unittest tests/test_listener_policy_check.py
python scripts/listener_policy_check.py --policy config/policy.json --bind-host 127.0.0.1 --transport http --inbound-auth false --downstream-credential false
```

Deployment-specific CI SHOULD add a second attestation step that inspects the effective socket, container port publication, Kubernetes Service/Ingress, and proxy path.

## Script/command
`tests/test_listener_policy_check.py` is the blocking deterministic startup-policy gate.

## Expected result
Tests exit 0. Loopback without auth is allowed by policy; non-loopback without inbound auth is rejected; non-loopback with inbound auth is allowed only when other required controls are satisfied.

## Failure behavior
Block startup/deployment. Reduce exposure or add proper inbound authentication. Do not treat a downstream API token as satisfying the gate.

## Blocks completion
Yes.
