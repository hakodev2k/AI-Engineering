# Portainer connector workflows

All outputs wrap provider data with `untrusted_provider_data: true`.

## Inspect fleet
Tool: `portainer.environment.list`
Input: `{}`
Permission: READ
Approval: no
Expected output: Portainer environments/endpoints visible to the configured token.

## Inspect containers
Tool: `portainer.container.list`
Input: `{ "environment_id": 3, "all": true }`
Permission: READ
Approval: no
Expected output: Docker container metadata for environment 3.

## Controlled stack restart
First call `portainer.stack.get` to verify the target. Then call `portainer.stack.stop` and, after observing state, `portainer.stack.start`.
Input shape: `{ "stack_id": 12, "environment_id": 3, "approval_token": "<human supplied>" }`
Permission: HIGH_RISK
Approval: yes, for each execution. The connector does not automatically chain stop/start.
