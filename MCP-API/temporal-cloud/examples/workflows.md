# Temporal Cloud connector workflows

Provider responses are returned as `{ "untrusted_provider_data": true, "data": ... }`.

## Inventory and capacity review

1. `temporal_cloud.account.get` — `{}` — READ — no approval.
2. `temporal_cloud.namespace.list` — `{"pageSize":100}` — READ — no approval.
3. `temporal_cloud.namespace.get` — `{"namespace":"orders-prod.a1b2c"}` — READ — no approval.
4. `temporal_cloud.namespace.capacity.get` — `{"namespace":"orders-prod.a1b2c"}` — READ — no approval.
5. `temporal_cloud.region.list` — `{}` — READ — no approval.

Expected output shape: an untrusted-data envelope whose `data` field contains the provider's current Cloud Ops API response.

## Identity and access audit

Call `temporal_cloud.identity.get`, `temporal_cloud.user.list`, and `temporal_cloud.service_account.list`, then query `temporal_cloud.audit_log.list` with a bounded time window/page. These tools are READ and require no connector approval; provider RBAC still applies.

## Create a namespace

`temporal_cloud.namespace.create` is HIGH_RISK because it provisions a billable control-plane resource. The operator must set `TEMPORAL_CLOUD_ALLOW_HIGH_RISK=true`, keep `TEMPORAL_CLOUD_APPROVAL_SECRET` outside model context, review the exact payload, and mint `approvalToken = HMAC-SHA256(secret, toolName + "\n" + canonicalJson(payloadWithoutApprovalToken))`.

Example payload before approval:

```json
{
  "name": "orders-stage",
  "regions": ["aws-us-west-2"],
  "retentionDays": 7,
  "description": "Staging workflows",
  "apiKeyAuth": true
}
```

## Update namespace tags

`temporal_cloud.namespace.tags.update` is WRITE. It requires `TEMPORAL_CLOUD_ALLOW_WRITE=true` and a payload-bound approval token. Example payload before approval:

```json
{
  "namespace": "orders-stage.a1b2c",
  "tagsToUpsert": {"environment":"staging","owner":"platform"}
}
```

## Delete a namespace

`temporal_cloud.namespace.delete` is DESTRUCTIVE and disabled by default. It requires `TEMPORAL_CLOUD_ALLOW_DESTRUCTIVE=true`, a fresh namespace `resourceVersion`, exact confirmation text `DELETE TEMPORAL NAMESPACE <namespace>`, and an approval token bound to the complete payload. The connector never retries this call automatically.
