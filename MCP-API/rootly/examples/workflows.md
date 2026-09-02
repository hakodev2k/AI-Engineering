# Rootly connector workflows

## Investigate an active incident

1. `rootly.incident.list` with `{ "search": "database", "pageSize": 20 }` — READ, no approval.
2. `rootly.incident.get` with `{ "incidentId": "INCIDENT_ID" }` — READ, no approval.
3. `rootly.incident.events.list` — READ the timeline.
4. `rootly.incident.alerts.list` — READ linked alerts.

## Prepare an on-call handoff

Use `rootly.oncall.handoff.get` with an optional IANA timezone and team IDs. The connector calls Rootly's official MCP `get_oncall_handoff_summary` tool. Permission: READ; approval: none.

## Review workload

Use `rootly.oncall.metrics.get` with ISO dates and group by `user`, `team`, or `schedule`. The connector calls Rootly's official MCP analytics tool and returns provider data as untrusted content.

## Correlate incidents with a shift

Use `rootly.shift.incidents.get` with ISO-8601 start/end timestamps and optional severity/status/tags filters. Permission: READ; approval: none.
