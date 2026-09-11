# Example workflows

All examples assume the MCP server is already configured with a SolarWinds Incident Response (formerly Squadcast) refresh token. Provider credentials remain inside the connector process.

## Inspect an incident before taking action

1. Tool: `solarwinds_ir.incident.get`
   Input: `{ "incidentId": "INCIDENT_ID" }`
   Permission: `READ`
   Approval: not required
   Expected output: provider JSON describing the incident.

2. Tool: `solarwinds_ir.incident.events.list`
   Input: `{ "incidentId": "INCIDENT_ID", "pageSize": 50 }`
   Permission: `READ`
   Approval: not required
   Expected output: provider JSON containing incident timeline events.

3. Tool: `solarwinds_ir.incident.acknowledge`
   Input: `{ "incidentId": "INCIDENT_ID", "approvalToken": "<human-provided-approval>" }`
   Permission: `WRITE`
   Approval: required
   Expected output: provider acknowledgement response.

## Inspect current on-call configuration

1. Tool: `solarwinds_ir.schedule.list`
   Input: `{ "teamId": "TEAM_ID", "hidePaused": true, "pageSize": 25 }`
   Permission: `READ`
   Approval: not required

2. Tool: `solarwinds_ir.schedule.get`
   Input: `{ "scheduleId": "SCHEDULE_ID" }`
   Permission: `READ`
   Approval: not required

3. Tool: `solarwinds_ir.schedule.override.list`
   Input: `{ "scheduleId": "SCHEDULE_ID", "startTime": "2026-09-11T00:00:00Z", "endTime": "2026-09-12T00:00:00Z" }`
   Permission: `READ`
   Approval: not required

## Pause a schedule safely

1. Read the schedule using `solarwinds_ir.schedule.get`.
2. Confirm the intended schedule and operational impact with a human.
3. Tool: `solarwinds_ir.schedule.pause`
   Input: `{ "scheduleId": "SCHEDULE_ID", "approvalToken": "<human-provided-approval>" }`
   Permission: `HIGH_RISK`
   Approval: required

Resume uses `solarwinds_ir.schedule.resume` with the same approval boundary.

## Investigate operational trends

Tool: `solarwinds_ir.analytics.organization.get`

Input:

```json
{
  "from": "2026-09-01T00:00:00Z",
  "to": "2026-09-11T00:00:00Z",
  "teamId": "TEAM_ID"
}
```

Permission: `READ`
Approval: not required

For audit evidence, call `solarwinds_ir.audit_log.list` with explicit `startDate`, `endDate`, `page`, and bounded `pageSize` values.
