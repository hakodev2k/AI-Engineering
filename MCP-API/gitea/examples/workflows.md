# Gitea connector workflow examples

## Inspect a repository

Tool: `gitea.repository.get`

Input:
```json
{"owner":"acme","repo":"service-api"}
```

Permission: READ. Approval: no.

Expected output: repository metadata returned by Gitea.

## Read a file at a branch

Tool: `gitea.file.read`

Input:
```json
{"owner":"acme","repo":"service-api","path":"src/index.ts","ref":"main"}
```

Permission: READ. Approval: no.

Expected output: Gitea contents API response, including base64 content for files when provided by the server.

## Create an issue

Tool: `gitea.issue.create`

Input:
```json
{"owner":"acme","repo":"service-api","title":"Investigate timeout regression","body":"Observed after release 1.8.0","approval_id":"<HMAC approval>"}
```

Permission: WRITE. Approval: yes. `GITEA_ALLOW_WRITES=true` is also required.

Expected output: created issue metadata.

## Comment on an issue

Tool: `gitea.issue.comment.create`

Input:
```json
{"owner":"acme","repo":"service-api","index":42,"body":"Reproduced in staging.","approval_id":"<HMAC approval>"}
```

Permission: WRITE. Approval: yes.

## Create a pull request

Tool: `gitea.pull_request.create`

Input:
```json
{"owner":"acme","repo":"service-api","head":"fix/timeout","base":"main","title":"Fix timeout handling","body":"Bounds downstream retries.","approval_id":"<HMAC approval>"}
```

Permission: WRITE. Approval: yes.

Expected output: created pull request metadata.
