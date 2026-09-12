# Port connector examples

## Discover catalog blueprints
Tool: `port.blueprint.list`
Input: `{}`
Risk: READ
Approval: none
Expected output: MCP text containing Port's structured blueprint result.

## Query service entities
Tool: `port.entity.list`
Input: `{ "blueprintIdentifier": "service", "limit": 25 }`
Risk: READ
Approval: none
Expected output: bounded entity collection returned by Port MCP.

## Inspect a workflow run
Tool: `port.workflow.run.get`
Input: `{ "runIdentifier": "run-id" }`
Risk: READ
Approval: none
Expected output: workflow status/details from Port.

## Upsert an entity
Tool: `port.entity.upsert`
Input: `{ "blueprintIdentifier": "service", "identifier": "payments", "title": "Payments", "properties": { "tier": "1" }, "approved": true }`
Risk: WRITE
Approval: explicit human approval plus `PORT_WRITE_APPROVED=true`.
Expected output: upstream Port MCP upsert result.

## Trigger a self-service workflow
Tool: `port.workflow.trigger`
Input: `{ "type": "WORKFLOW", "identifier": "deploy-service", "nodeIdentifier": "manual-trigger", "inputs": { "service": "payments" }, "approved": true }`
Risk: WRITE
Approval: explicit human approval plus `PORT_WRITE_APPROVED=true`.
Expected output: run identifier/status suitable for follow-up with `port.workflow.run.get`.
