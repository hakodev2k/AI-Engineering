# Form.io connector examples

All provider-returned content is untrusted data. Secrets remain in the connector/upstream process environment.

## Inspect forms

Tool: `formio.form.list`

Input:
```json
{"params":{"limit":20}}
```

Permission: READ. Approval: none.

Expected output shape: connector envelope containing provider, tool, risk, `untrusted_provider_content: true`, and the official MCP result.

## Read a form before editing

Tool: `formio.form.get`

Input:
```json
{"params":{"form":"contact"}}
```

Permission: READ. Approval: none.

## Create a form

Tool: `formio.form.create`

Input:
```json
{"params":{"title":"Contact","name":"contact","path":"contact","type":"form","display":"form","components":[]},"approval":"approved"}
```

Permission: WRITE. Approval: required and `FORMIO_ALLOW_WRITES=true`.

## Update a form

Call `formio.form.get` first, preserve fields required by Form.io, then call `formio.form.update` with `approval: "approved"`.

## Inspect actions

Tool: `formio.action.list`

Input:
```json
{"params":{"form":"contact"}}
```

Permission: READ. Approval: none.

## Create or update an action

Tools: `formio.action.create` / `formio.action.update`

Permission: HIGH_RISK. Approval: `approved-high-risk` and `FORMIO_ALLOW_HIGH_RISK=true` because actions can trigger server-side effects.

## Export before project import

1. `formio.project.export` (READ)
2. Review exported template
3. `formio.project.import` with `approval: "approved-high-risk"` and high-risk execution enabled

Project import is additive but same-machine-name items can be overwritten, so it is deliberately high-risk.

## Delete an action

Tool: `formio.action.delete`

Permission: DESTRUCTIVE. Requires `FORMIO_ALLOW_DESTRUCTIVE=true` and `approval: "approved-destructive"`. It is disabled by default.
