# Vault connector workflows

`vault.permission.check` (READ, REST fallback):
```json
{"paths":["secret/metadata/my-app","secret/data/my-app"]}
```

`vault.secret.list` (READ, official MCP):
```json
{"mount":"secret","path":"my-app"}
```

`vault.secret.write` (WRITE, approval required, official MCP):
```json
{"mount":"secret","path":"my-app/config","key":"API_URL","value":"https://api.example.com","approval_token":"<payload-bound HMAC>"}
```

`vault.pki.certificate.issue` (HIGH_RISK, approval required, official MCP):
```json
{"mount":"pki-app","role":"web","commonName":"service.example.com","altNames":["service.internal.example.com"],"ttl":"24h","approval_token":"<payload-bound HMAC>"}
```
