# Linode connector workflows

Read inventory: call `linode.instance.list` with `{ "page": 1, "pageSize": 100 }`. Permission: READ. Approval: none. Output wraps the Linode response with `untrustedProviderData: true` and rate-limit metadata.

Inspect health: call `linode.instance.get`, then `linode.instance.stats` for the same `linodeId`. Permission: READ. Approval: none.

Controlled reboot: first inspect the instance. A trusted approval service computes HMAC-SHA256 over `linode.instance.reboot\n<canonical payload>` using `LINODE_APPROVAL_SECRET`; enable `LINODE_ALLOW_HIGH_RISK=true`, then call with the exact `linodeId` and `approvalToken`. Permission: HIGH_RISK. Approval: required.

Deletion: inspect the instance, enable `LINODE_ALLOW_DESTRUCTIVE=true` only for the approved change window, generate payload-bound approval, and pass `confirm: "DELETE LINODE <id>"`. Permission: DESTRUCTIVE. Approval: required. Delete is never retried automatically.
