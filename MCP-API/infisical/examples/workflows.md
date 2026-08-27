# Infisical connector examples

`infisical.secret.list_metadata` (READ, no approval):
```json
{"projectId":"project-id","environment":"prod","secretPath":"/payments","recursive":false}
```

`infisical.secret.exists` (READ, no approval):
```json
{"projectId":"project-id","environment":"prod","secretPath":"/payments","secretName":"STRIPE_API_KEY"}
```

`infisical.secret.create` (WRITE, approval required):
```json
{"projectId":"project-id","environment":"dev","secretPath":"/backend","secretName":"NEW_SERVICE_TOKEN","secretValue":"<caller-supplied-value>","approval_token":"<HMAC-SHA256>"}
```

`infisical.secret.delete` (DESTRUCTIVE, approval + feature flag required):
```json
{"projectId":"project-id","environment":"dev","secretPath":"/backend","secretName":"OLD_SERVICE_TOKEN","approval_token":"<HMAC-SHA256>"}
```
