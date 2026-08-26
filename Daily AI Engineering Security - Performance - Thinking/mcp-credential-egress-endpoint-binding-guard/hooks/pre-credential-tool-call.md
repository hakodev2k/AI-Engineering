# Hook: Pre-Credential Tool Call
## Trigger
Before any configured tool call that can transmit a credential or sensitive token to a destination.
## Preconditions
Tool name, credential class and destination are known; policy is loaded before the outbound request is constructed.
## Action
Serialize only non-secret metadata and run: `python scripts/endpoint_binding_guard.py --event <event.json> --policy config/egress-policy.json`.
## Expected result
Exit 0 with `decision=allow` for a destination explicitly bound to the credential class and tool.
## Failure behavior
Exit 2 indicates invalid evidence/config; exit 3 indicates policy block. Both prevent the outbound call. Exception handling requires explicit human approval outside the model-controlled path.
## Blocking
Yes. Failure MUST block before credentials are materialized into request headers, bodies or URLs.
