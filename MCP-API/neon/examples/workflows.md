# Neon connector workflows

## Inspect a project

Tool: `neon.project.list`

```json
{ "limit": 10 }
```

Permission: READ. Approval: no.

Then call `neon.project.get`:

```json
{ "projectId": "project-id" }
```

Expected output: JSON-serialized official Neon MCP result containing project metadata.

## Inspect schema and query safely

Tool: `neon.database.table.list`

```json
{ "projectId": "project-id", "branchId": "branch-id", "databaseName": "neondb" }
```

Tool: `neon.database.query.read`

```json
{ "projectId": "project-id", "branchId": "branch-id", "databaseName": "neondb", "sql": "SELECT id, created_at FROM users ORDER BY created_at DESC LIMIT 20" }
```

Permission: READ. Approval: no. Mutating SQL is rejected locally. With `NEON_READONLY=true`, Neon also enforces read-only behavior upstream.

## Create an isolated branch

Set `NEON_READONLY=false`, configure `NEON_APPROVAL_SECRET`, and calculate the approval token as HMAC-SHA256(secret, `neon.branch.create`).

Tool: `neon.branch.create`

```json
{ "projectId": "project-id", "name": "agent-preview", "parentBranchId": "branch-id", "approvalId": "<approved-hmac>" }
```

Permission: WRITE. Approval: required.

## Delete an isolated branch

Tool: `neon.branch.delete`

```json
{ "projectId": "project-id", "branchId": "branch-id", "approvalId": "<approved-hmac>" }
```

Permission: DESTRUCTIVE. Approval: required. This operation is unavailable while `NEON_READONLY=true`.
