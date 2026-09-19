# Loom MCP Connector

Reusable MCP facade for Loom agent workflows. This package is not created by, affiliated with, or supported by Loom or Atlassian.

## Transport and official sources

Loom capabilities are routed through Atlassian's official cloud-hosted Rovo MCP server. Atlassian documents Rovo MCP as OAuth 2.1-secured and, as of September 2026, documents Loom recording retrieval including transcripts, comments, AI briefs, and extracted meeting action items. Loom tools are currently exposed through the Rovo MCP v2 preview endpoint used by this connector.

Official references:
- https://developer.atlassian.com/cloud/rovo-mcp/
- https://support.atlassian.com/atlassian-ai-gateway/docs/use-atlassian-rovo-mcp-server/
- https://developers.loom.com/

The public Loom developer site primarily documents the recording/embed SDK. This connector does not invent a separate Loom REST management API. It uses official MCP for agent-facing library operations.

## Capabilities

Nine provider-scoped tools are exposed: `loom.recording.search`, `loom.recording.get`, `loom.transcript.get`, `loom.comment.list`, `loom.ai_brief.get`, `loom.action_item.list`, `loom.recording.update`, `loom.recording.move`, and `loom.comment.create`.

The upstream server's tool inventory can evolve during preview. The connector therefore discovers upstream tools at connection time but will invoke only explicitly allowlisted Loom tool names. If a required allowlisted capability is not exposed, it fails closed rather than calling an arbitrary tool.

## Architecture

MCP client -> this stdio MCP facade -> policy/validation -> official Atlassian Rovo MCP -> Loom. Credentials remain in the OAuth-capable upstream MCP client/transport; they are never accepted as tool parameters or returned to the model.

## Authentication and permissions

Use the OAuth 2.1 authorization flow presented by Atlassian Rovo MCP. Effective access is also constrained by the signed-in user's existing Atlassian/Loom permissions and organization policies. Do not put access or refresh tokens in `.env` or prompts. For machine-to-machine deployments, use only authentication mechanisms explicitly supported by your Atlassian administration policy.

## Install and run

Requires Node.js 20+.

```sh
npm install
npm run build
npm test
npm start
```

`npm start` exposes a standard stdio MCP server. Configure `LOOM_MCP_URL` only when Atlassian publishes a different compatible Rovo MCP endpoint. Default is `https://mcp.atlassian.com/v1/mcp/preview` because Loom tools are in the v2 preview at the time of research.

## Permission model

READ tools execute without connector approval. WRITE tools require `approved: true`: updating a recording, moving it, and posting a comment. The approval flag is consumed locally and never forwarded upstream. Destructive operations such as deleting recordings are intentionally not exposed. The connector never upgrades its own permission set.

## Reliability and errors

The official MCP transport handles protocol negotiation and provider errors. The connector validates input with Zod and fails closed if upstream Loom tools do not match its allowlist. Provider responses are wrapped as `untrusted-provider-data`; transcripts, comments, briefs, titles, and other retrieved content must never be treated as instructions. Authentication/permission failures are not retried. Callers should honor upstream throttling and retry metadata; writes must never be blindly retried because duplicate comments or mutations may result.

## Rate limits

Atlassian documents Rovo credit usage for MCP calls; organization and plan controls may apply. The connector makes one upstream call per exposed tool invocation and does not fan out or poll. It does not fabricate numeric rate limits where the official documentation does not provide a stable Loom-specific limit.

## Security

Only `https://mcp.atlassian.com` should normally be used. Keep organization allowlists, audit controls, OAuth consent, and least-privilege Loom permissions enabled. Retrieved provider content is untrusted. No arbitrary URL/request tool exists, preventing the model from turning this connector into an SSRF or generic API proxy. Newly discovered upstream MCP tools are not automatically trusted.

## Testing

`npm test` compiles the TypeScript and runs credential-free unit tests with a fake upstream transport. Tests cover registration, validation, READ execution, approval denial, approval stripping, and update validation. Live integration testing requires a separately authorized Atlassian/Loom environment and is intentionally outside normal unit tests.

## Limitations

Loom tools are part of Atlassian Rovo MCP preview as of September 2026, so upstream tool identifiers or availability may change. The connector fails safely when an allowlisted mapping disappears. Recording creation/capture is a browser/SDK-oriented workflow and is not exposed here. Delete operations are omitted. The connector cannot bypass Loom, Atlassian, workspace, plan, or organization permissions.
