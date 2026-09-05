# Hook: Predeploy MCP Auth Gate

## Trigger
Before deploying or enabling LiteLLM MCP routes.

## Preconditions
Effective gateway model JSON is generated from deployment configuration.

## Action
Run the fail-closed checker and retain output as release evidence.

## Script / command
`python scripts/check_litellm_mcp_auth.py <gateway.json>`

## Expected result
Exit 0 with `PASS`.

## Failure behavior
Exit 2 blocks deployment for security findings. Exit 1 blocks deployment because the state could not be validated.

## Blocks completion
Yes.