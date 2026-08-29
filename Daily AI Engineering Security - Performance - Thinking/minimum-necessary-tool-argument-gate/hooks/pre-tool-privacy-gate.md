# Hook: Pre-Tool Privacy Gate

## Trigger
Immediately after the model/runtime proposes a tool call and before any external tool, MCP server, network request, telemetry sink, or persistent external log receives argument values.

## Preconditions
Policy file is available from a trusted local path; proposed request is valid JSON; external execution has not started.

## Action
Run the deterministic sanitizer against the proposed call. Reject malformed requests, unknown tools requiring review, and blocked secret-bearing fields. Pass only the sanitized request to the executor.

## Script / command
```bash
python scripts/tool_arg_minimizer.py proposed-tool-call.json --policy config/policy.example.json --out sanitized-tool-call.json
```

## Expected result
Exit `0` and an output document with `decision=allow` plus sanitized arguments, or exit `2` with `decision=review`/`block`.

## Failure behavior
Parsing, policy, or validation failure blocks external execution. Do not fall back to the original unsanitized call.

## Blocks completion
Yes. A call that fails the privacy gate cannot be considered safely executed.
