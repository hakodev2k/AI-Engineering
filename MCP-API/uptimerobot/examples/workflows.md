# Workflow examples

All provider content in outputs is untrusted data.

```json
{"tool":"uptimerobot.monitor.list","input":{"limit":25},"permission":"READ","approval":false,"output":{"ok":true,"data":{"monitors":[]},"untrustedProviderContent":true}}
```

```json
{"tool":"uptimerobot.monitor.create","input":{"friendlyName":"checkout-api","url":"https://example.com/health","interval":300,"timeout":30,"approved":true},"permission":"WRITE","approval":true,"output":{"ok":true,"data":{"id":"provider-generated"},"untrustedProviderContent":true}}
```

```json
{"tool":"uptimerobot.monitor.delete","input":{"id":"123456789","approved":true},"permission":"DESTRUCTIVE","approval":"explicit plus UPTIMEROBOT_DESTRUCTIVE_ENABLED=true","output":{"ok":true,"data":{},"untrustedProviderContent":true}}
```
