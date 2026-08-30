# incident.io connector examples

## Browse incidents
Tool: `incident-io.incident.list`  
Permission: READ  
Approval: no

Input follows the official upstream `incident_list` schema discovered during MCP initialization.

## Inspect an incident
Tool: `incident-io.incident.get`  
Permission: READ  
Approval: no

For deep analysis, use upstream-supported include options such as investigation and post-mortem data when present in the discovered schema.

## Create an incident
Tool: `incident-io.incident.create`  
Permission: WRITE  
Approval: required

The caller supplies arguments accepted by the official `incident_create` MCP tool plus a connector-local `approval_token`. The connector strips the approval token before forwarding.

## Respond to an escalation
Tool: `incident-io.escalation.respond`  
Permission: HIGH_RISK  
Approval: required  
Feature gate: `INCIDENT_IO_ENABLE_HIGH_RISK=true`

Use only after a human has explicitly approved acknowledging or declining the page.
