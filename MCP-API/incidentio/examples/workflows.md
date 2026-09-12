# incident.io MCP connector examples

All `params` objects are validated at runtime against the live input schema published by the official incident.io MCP server. Provider responses are returned as untrusted data.

## Read an incident

Tool: `incidentio.incident.show`

```json
{
  "params": {
    "id": "INC-123",
    "include": ["investigation", "postmortem"]
  }
}
```

Permission: `READ`. Approval: no.

Expected shape: a connector envelope containing `provider`, `tool`, `risk`, `untrusted_provider_content`, and the official MCP result.

## Analyse incident trends

Tool: `incidentio.incident.stats`

```json
{
  "params": {
    "from": "2026-09-01T00:00:00Z",
    "to": "2026-09-13T00:00:00Z"
  }
}
```

Permission: `READ`. Approval: no. Use stats before broad list pagination where possible.

## Create an incident

Tool: `incidentio.incident.create`

```json
{
  "params": {
    "name": "Payments API degraded",
    "severity": "P2"
  },
  "approval": "approved"
}
```

Permission: `WRITE`. Approval: yes, and the process must be started with `INCIDENTIO_WRITE_APPROVED=true`. Exact accepted fields are controlled by the official upstream MCP schema and may use organization-specific IDs/configuration.

## Create a follow-up

Tool: `incidentio.follow_up.create`

```json
{
  "params": {
    "incident_id": "INC-123",
    "description": "Add circuit-breaker metrics to the runbook"
  },
  "approval": "approved"
}
```

Permission: `WRITE`. Approval: yes.

## Acknowledge or decline a page

Tool: `incidentio.escalation.respond`

```json
{
  "params": {
    "id": "escalation-id",
    "response": "acknowledge"
  },
  "approval": "approved-high-risk"
}
```

Permission: `HIGH_RISK`. Approval: yes, and the process must be started with `INCIDENTIO_HIGH_RISK_APPROVED=true`.
