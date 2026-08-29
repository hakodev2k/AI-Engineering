# Convex connector examples

`convex.project.list` — READ, no approval:
```json
{"teamId":"41","limit":25}
```

`convex.deployment.get` — READ, no approval:
```json
{"projectId":"123","deploymentType":"prod"}
```

`convex.deployment.custom_domain_list` — READ, no approval:
```json
{"deploymentName":"happy-otter-123"}
```

`convex.deployment.delete` — DESTRUCTIVE, explicit approval and feature flag required:
```json
{"deploymentName":"preview-branch-123","approval_token":"<payload-bound HMAC-SHA256>"}
```
