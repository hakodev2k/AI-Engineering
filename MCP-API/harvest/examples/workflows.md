# Workflow examples

## Inspect work before reporting
1. `harvest.projects.list` — `{ "page":1,"per_page":100 }` — READ — approval: no.
2. `harvest.time_entries.list` — `{ "page":1,"per_page":100 }` — READ — approval: no.
3. `harvest.reports.time_projects` — `{ "from":"2026-09-01","to":"2026-09-21","page":1,"per_page":100 }` — READ — approval: no.
Expected shape: `{ "data": <Harvest API response>, "untrusted_provider_content": true }`.

## Record approved time
`harvest.time_entries.create` — `{ "project_id":123,"task_id":456,"spent_date":"2026-09-21","hours":2,"notes":"Implementation","approved":true }` — WRITE — approval: yes and `HARVEST_ALLOW_WRITES=true`.
Expected shape: `{ "data": <time entry>, "untrusted_provider_content": true }`.

## Stop an approved running timer
`harvest.time_entries.stop` — `{ "id":789,"approved":true }` — WRITE — approval: yes and writes enabled.
Expected shape: `{ "data": <time entry>, "untrusted_provider_content": true }`.