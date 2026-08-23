# Hook: Pre Tool Call

## Trigger

Immediately before a protected tool adapter performs an invocation.

## Preconditions

The complete request JSON exists and no post-gate argument interpolation will occur.

## Action

Run:

```bash
python scripts/gate_tool_call.py --request "$REQUEST_JSON" --policy config/policy.json --output "$DECISION_JSON"
```

If a human approval exists, add `--approval "$APPROVAL_JSON"`.

## Expected result

Exit `0` and decision status `allow` before the adapter invokes the tool.

## Failure behavior

Codes `2`, `3`, `4`, or `5` block execution. Preserve the decision JSON. Do not retry a deny or approval-required outcome automatically.

## Blocking

Yes. This hook is fail-closed.