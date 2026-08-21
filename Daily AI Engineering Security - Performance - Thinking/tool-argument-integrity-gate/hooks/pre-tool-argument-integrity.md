# Hook: Pre-tool Argument Integrity Gate

## Trigger
After the harness has parsed a tool call into `{tool, arguments}` and immediately before authorization/execution for a high-risk tool.

## Preconditions
A normalized schema-policy JSON exists for the target tool and the exact parsed call is available as JSON.

## Action
Run the deterministic integrity checker. BLOCK when it detects a declared sibling parameter embedded inside another string while the sibling is missing/null, an unexempted invocation-boundary residue, a required-field failure, or a configured critical-field failure.

## Command
```bash
python3 scripts/tool_arg_integrity.py \
  --call parsed-call.json \
  --policy tool-policy.json
```

## Expected result
Exit 0 with JSON containing `decision: "ALLOW"` and no blocking reason codes.

## Failure behavior
- Exit 2: invalid call/policy/configuration. High-risk dispatch is blocked.
- Exit 3: integrity violation. Dispatch is blocked and the harness may request re-composition up to two times.
- After two failed re-compositions, stop and escalate; do not loop.

## Logging
Record tool name, reason codes, affected field names, lengths, and optional non-secret hashes. Do not log complete sensitive argument values.

## Blocking
Yes. The hook MUST run before any side effect. Availability failures do not justify bypassing the gate for high-risk tools.