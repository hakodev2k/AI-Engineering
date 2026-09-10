# CockroachDB Cloud connector workflows

## Inventory a cluster

1. Tool: `cockroachdb_cloud.cluster.list`
   Input: `{ "page": 1, "limit": 20 }`
   Permission: READ
   Approval: no
   Output: provider cluster-list payload wrapped as untrusted provider content.
2. Tool: `cockroachdb_cloud.cluster.get`
   Input: `{ "clusterId": "11111111-1111-4111-8111-111111111111" }`
   Permission: READ
   Approval: no
3. Tool: `cockroachdb_cloud.cluster.nodes.list`
   Input: `{ "clusterId": "11111111-1111-4111-8111-111111111111" }`
   Permission: READ
   Approval: no

## Inspect database and users

1. `cockroachdb_cloud.database.list`
   Input: `{ "clusterId": "11111111-1111-4111-8111-111111111111", "page": 1, "limit": 50 }`
   Permission: READ
2. `cockroachdb_cloud.sql_user.list`
   Input: `{ "clusterId": "11111111-1111-4111-8111-111111111111", "page": 1, "limit": 50 }`
   Permission: READ
3. `cockroachdb_cloud.cluster.connection_string.get`
   Input: `{ "clusterId": "11111111-1111-4111-8111-111111111111", "database": "app", "sqlUser": "app_reader", "os": "LINUX" }`
   Permission: READ
   Note: a connection string is operationally sensitive metadata; do not publish it even though this tool does not return a SQL password.

## Review available major versions

Tool: `cockroachdb_cloud.cluster.version.list`
Input: `{ "page": 1, "limit": 50 }`
Permission: READ
Approval: no

## Delete a SQL user

1. Human/operator reviews the exact cluster and SQL username.
2. Generate an approval outside the agent context:

```bash
COCKROACH_CLOUD_APPROVAL_SECRET='operator-held-secret' \
node examples/create-approval.mjs cockroachdb_cloud.sql_user.delete \
'{"clusterId":"11111111-1111-4111-8111-111111111111","username":"old_app","confirmUsername":"old_app"}'
```

3. Tool: `cockroachdb_cloud.sql_user.delete`
   Input includes the exact returned `approvalId` plus the same cluster/user/confirmation fields.
   Permission: DESTRUCTIVE
   Approval: always, and `COCKROACH_CLOUD_ALLOW_DESTRUCTIVE=true` must be set by the host.

Expected output shape:

```json
{
  "untrusted_provider_content": true,
  "data": {}
}
```

## Delete a cluster

Use only after an explicit human decision and independent backup/recovery review.

Tool: `cockroachdb_cloud.cluster.delete`

The call requires all of:
- `COCKROACH_CLOUD_ALLOW_DESTRUCTIVE=true` configured outside the model;
- `confirmClusterId` exactly equal to `clusterId`;
- a payload-bound `approvalId` generated with the helper.

The connector sends the DELETE request once and never blindly retries it.
