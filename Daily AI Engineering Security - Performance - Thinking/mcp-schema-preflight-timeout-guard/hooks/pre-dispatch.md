# Hook: Pre-Dispatch MCP Validation

## Trigger
Immediately before an MCP tool call enters transport/server execution.

## Preconditions
The runtime has resolved the concrete tool name and candidate arguments.

## Action
Serialize the preflight request and run:

`python scripts/mcp_preflight.py request.json --policy config/policy.json`

## Expected result
- Exit `0`: arguments are allowed for dispatch; continue through normal authorization/approval/middleware.
- Exit `3`: do not dispatch; return structured validation errors to the agent for one bounded repair attempt.
- Exit `4`: do not dispatch; identical invalid retry budget is exhausted; re-plan or escalate.
- Exit `2`: block automated completion because preflight input/config is invalid.

## Failure behavior
Validator crashes, malformed policy, or malformed preflight input are observable failures. Do not reinterpret them as successful validation.

## Blocks completion
Yes when a known schema violation exists, identical-invalid retries are exhausted, or the validation hook itself is misconfigured.

## Logging
Record tool name, decision, validation latency, fingerprint, timeout budget, and downstream dispatch/result class. Do not log secrets or sensitive argument values; hash/redact them where required.
