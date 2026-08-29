# Hook: Pre-Tool-Call Origin Gate

## Trigger
Immediately before a Host/gateway dispatches an MCP tool invocation.

## Preconditions
Trusted Host request context has been converted to the schema in `schemas/tool-origin-record.schema.json`; tool visibility and policy are current.

## Action
Run the deterministic origin policy gate. Caller-supplied origin markers are advisory/untrusted only.

## Script/command
```bash
python scripts/origin_provenance_gate.py \
  --input artifacts/tool-call-origin.json \
  --json-out artifacts/tool-call-origin-report.json
```

## Expected result
Exit `0` and `allow: true`, after which normal authentication/authorization/approval checks continue.

## Failure behavior
Exit `2`: block dispatch. Exit `3`: invalid evidence/config; refresh trusted context once, then block.

## Blocking
Yes for origin-sensitive tools.
