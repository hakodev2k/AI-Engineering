# Statuspage connector examples

Read operations such as `statuspage.page.get`, `statuspage.component.list`, and `statuspage.incident.list` require no approval. Mutations require a payload-bound HMAC approval token generated outside the agent using `STATUSPAGE_APPROVAL_SECRET`.

```json
{"tool":"statuspage.incident.list","input":{"page_id":"your-page-id","q":"database","limit":50,"page":1},"permission":"READ","approval":false}
```

```json
{"tool":"statuspage.component.update","input":{"page_id":"your-page-id","component_id":"component-id","component":{"status":"degraded_performance"},"approval_token":"<payload-bound-hmac>"},"permission":"WRITE","approval":true}
```

```json
{"tool":"statuspage.incident.create","input":{"page_id":"your-page-id","incident":{"name":"API latency","status":"investigating","body":"We are investigating elevated latency.","deliver_notifications":true},"approval_token":"<payload-bound-hmac>"},"permission":"HIGH_RISK","approval":true}
```

```json
{"tool":"statuspage.incident.delete","input":{"page_id":"your-page-id","incident_id":"incident-id","approval_token":"<payload-bound-hmac>"},"permission":"DESTRUCTIVE","approval":true,"additional_gate":"STATUSPAGE_ENABLE_DESTRUCTIVE=true"}
```
