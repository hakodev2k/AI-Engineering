# Workflow examples

```json
{"tool":"deno-deploy.app.list","input":{},"permission":"READ","approval":false,"output":{"ok":true,"data":[{"id":"...","slug":"preview-api"}]}}
```

```json
{"tool":"deno-deploy.app.create","input":{"slug":"preview-api","approved":true},"permission":"WRITE","approval":true,"output":{"ok":true,"data":{"id":"...","slug":"preview-api"}}}
```

```json
{"tool":"deno-deploy.volume.create","input":{"slug":"build-cache","capacity":"2GB","approved":true},"permission":"WRITE","approval":true,"output":{"ok":true,"data":{"id":"...","slug":"build-cache","region":"ord"}}}
```

```json
{"tool":"deno-deploy.volume.snapshot","input":{"volume":"build-cache","slug":"build-cache-v1","approved":true},"permission":"WRITE","approval":true,"output":{"ok":true,"data":{"id":"...","slug":"build-cache-v1"}}}
```

Deletion tools additionally require `DENO_DEPLOY_DESTRUCTIVE_ENABLED=true` and explicit `approved:true`.
