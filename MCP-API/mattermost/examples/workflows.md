# Mattermost connector workflows

## Search incident history

Tool: `mattermost.post.search`

```json
{"team_id":"TEAM_ID","query":"database latency","limit":20}
```

Permission: READ. Approval: no. Output is a JSON envelope containing `transport` (`mcp` or `rest`) and provider data.

## Read a post

Tool: `mattermost.post.get`

```json
{"post_id":"POST_ID","include_thread":true}
```

Permission: READ. Approval: no.

## Publish an approved response

Tool: `mattermost.post.create`

```json
{"channel_id":"CHANNEL_ID","message":"Service recovered. Monitoring continues.","approval":"64_HEX_HMAC_APPROVAL"}
```

Permission: WRITE. Approval: required. When official upstream MCP is configured, the connector invokes Mattermost `create_post`; otherwise it uses REST API v4.

## Update an approved post

Tool: `mattermost.post.update`

```json
{"post_id":"POST_ID","message":"Updated status text","approval":"64_HEX_HMAC_APPROVAL"}
```

Permission: WRITE. Approval: required. Transport: REST API v4.

## Delete a post

Tool: `mattermost.post.delete`

```json
{"post_id":"POST_ID","approval":"64_HEX_HMAC_APPROVAL"}
```

Permission: DESTRUCTIVE. Approval: required. The connector also requires `MATTERMOST_ENABLE_DESTRUCTIVE=true`; it is disabled by default.
