# Hook: Pre-Tool Policy Attestation

## Trigger
Immediately before a security-sensitive tool/command: unsandboxed shell, external network, secret access, deployment, repository write, MCP write tool, approval bypass, or policy-changing operation.

## Preconditions
Trusted baseline exists; root/config/state paths are absolute or resolved by trusted host configuration.

## Action
Run the attestation script in verification mode.

## Command
```bash
python scripts/policy_attest.py --root "$WORKSPACE" --config config/policy.json --state "$CONTROL_PLANE_BASELINE"
```

## Expected result
Exit `0` and JSON `status: verified`.

## Failure behavior
Any non-zero exit blocks dispatch. Persist stdout/stderr as audit evidence. Do not ask the same agent to repair or re-baseline its policy automatically.

## Blocks completion
Yes for any workflow that requires the protected privileged action.