# Redis Cloud workflows

## Inventory
Tool: `redis-cloud.subscription.list`
Input: `{}`
Risk: READ. Approval: no.
Expected: subscriptions wrapped as untrusted provider data.

Tool: `redis-cloud.database.list`
Input: `{"subscriptionId":123}`
Risk: READ. Approval: no.
Expected: databases in the selected subscription.

## Provision after human review
Tool: `redis-cloud.database.create`
Input: `{"subscriptionId":123,"name":"agent-cache","memoryLimitInGb":1,"throughputMeasurement":{"by":"operations-per-second","value":1000},"replication":true,"approved":true}`
Risk: HIGH_RISK because provisioning can affect cost/capacity. Explicit approval required.
Expected: Redis Cloud asynchronous task/resource response; use `redis-cloud.task.get` with the returned task identifier when applicable.

## Delete
Tool: `redis-cloud.database.delete`
Input: `{"subscriptionId":123,"databaseId":456,"approved":true}`
Risk: DESTRUCTIVE. Requires explicit approval plus operator setting `REDIS_CLOUD_ALLOW_DESTRUCTIVE=true`.
