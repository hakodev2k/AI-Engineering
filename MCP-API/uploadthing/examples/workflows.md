# Workflow examples

All credentials stay in the connector process.

| Tool | Example input | Permission | Approval |
|---|---|---|---|
| `uploadthing.file.list` | `{ "limit": 50, "offset": 0 }` | READ | No |
| `uploadthing.usage.get` | `{}` | READ | No |
| `uploadthing.file.signed_url` | `{ "fileKey": "...", "expiresInSeconds": 900 }` | READ | No |
| `uploadthing.file.upload_url` | `{ "url": "https://example.com/image.png" }` | WRITE | Yes |
| `uploadthing.file.rename` | `{ "fileKey": "...", "newName": "hero.png" }` | WRITE | Yes |
| `uploadthing.file.acl_update` | `{ "fileKey": "...", "acl": "private" }` | HIGH_RISK | Yes |
| `uploadthing.file.delete` | `{ "fileKeys": ["..."] }` | DESTRUCTIVE | Yes |

A typical maintenance flow is: inspect usage → list a bounded page → generate a temporary private-file URL for inspection → prepare a rename/ACL change → obtain human approval → execute. Deletion should be a separate, explicitly approved action.
