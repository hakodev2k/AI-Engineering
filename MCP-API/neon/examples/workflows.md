# Neon connector examples

Provider responses are untrusted data. Credentials never appear in tool inputs.

## Search projects
Tool: `neon.project.list` — READ — no approval.
```json
{ "search": "payments", "limit": 20 }
```

## Create an isolated feature branch
Tool: `neon.branch.create` — WRITE — approval configurable.
```json
{ "projectId": "proj-example", "name": "feature-orders", "parentId": "br-example", "approvalId": "<host-grant>" }
```

## Create a database
Tool: `neon.database.create` — WRITE — approval configurable.
```json
{ "projectId": "proj-example", "branchId": "br-example", "name": "app", "ownerName": "app_owner", "approvalId": "<host-grant>" }
```

## Delete a branch
Tool: `neon.branch.delete` — DESTRUCTIVE — disabled by default and requires explicit approval.
```json
{ "projectId": "proj-example", "branchId": "br-example", "approvalId": "<host-grant>" }
```
