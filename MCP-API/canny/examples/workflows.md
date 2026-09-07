# Canny connector examples

## Backlog discovery

Tool: `canny.post.list`

```json
{"boardID":"board-id","search":"dark mode","limit":20,"skip":0}
```

Permission: READ. Approval: no. Expected output: Canny post-list response with matching posts and pagination metadata.

## Create feedback

Tool: `canny.post.create`

```json
{"authorID":"user-id","boardID":"board-id","title":"Add dark mode","details":"Customers request a system-aware dark theme.","approved":true}
```

Permission: WRITE. Approval: required by default. Expected output: object containing the created post id.

## Change roadmap status

Tool: `canny.post.change_status`

```json
{"postID":"post-id","changerID":"admin-id","status":"planned","shouldNotifyVoters":false,"commentValue":"Accepted for roadmap planning.","approved":true}
```

Permission: HIGH_RISK. Approval: always explicit. Expected output: updated Canny post object.

## Add internal context

Tool: `canny.comment.create`

```json
{"authorID":"admin-id","postID":"post-id","value":"Enterprise customers mentioned this during QBRs.","internal":true,"shouldNotifyVoters":false,"approved":true}
```

Permission: WRITE. Approval: required by default. Expected output: object containing the comment id.
