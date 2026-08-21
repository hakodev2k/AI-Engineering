# Jira MCP/API Connector

Reusable Jira Cloud connector that exposes a narrow, provider-scoped MCP interface for AI agents while keeping Atlassian credentials inside the connector process.

## Transport strategy

This package intentionally uses a hybrid transport:

- **Official Atlassian Rovo MCP Server** for resource discovery, project listing, JQL search, issue reads, comments, field updates, and workflow transitions.
- **Official Jira Cloud REST API v3** only for `jira.issue.create`.

The REST fallback for issue creation is deliberate. Atlassian's official MCP repository has an open 2026 report where one `createJiraIssue` invocation can create duplicate issues, and another report describes MCP-side create failures for projects that REST can create in. A non-retried REST POST gives this connector a narrower and more predictable create boundary while preserving the same external MCP contract.

No unofficial MCP server is used.

## Official sources

- Atlassian Rovo MCP supported tools: `https://support.atlassian.com/atlassian-rovo-mcp-server/docs/supported-tools/`
- Atlassian MCP client setup: `https://support.atlassian.com/atlassian-rovo-mcp-server/docs/using-with-other-supported-mcp-clients/`
- Atlassian MCP security/admin controls: `https://support.atlassian.com/security-and-access-policies/docs/understand-atlassian-rovo-mcp-server/`
- Jira Cloud REST API: `https://developer.atlassian.com/cloud/jira/platform/rest/v3/`
- Jira rate limiting: `https://developer.atlassian.com/cloud/jira/platform/rate-limiting/`
- Official MCP implementation/issues: `https://github.com/atlassian/atlassian-mcp-server`

The legacy SSE endpoint was retired after June 30, 2026. The connector defaults to the current Streamable HTTP endpoint:

```text
https://mcp.atlassian.com/v1/mcp/authv2
```

## Architecture

```text
MCP client
  -> local Jira connector (stdio)
     -> validation / allowlists / approval policy
        -> Atlassian Rovo MCP (most tools)
        -> Jira REST API v3 (issue create only)
           -> Jira Cloud
```

Credentials never appear in MCP tool inputs or provider output. Retrieved Jira content is wrapped as `untrustedProviderData` and must be treated as data, not instructions.

## Authentication

The runtime expects an Atlassian OAuth access token in:

```text
ATLASSIAN_ACCESS_TOKEN=
```

The token is sent only from the connector transport layer as a Bearer credential. Do not place tokens in prompts, tool arguments, logs, examples, issue bodies, or approval IDs.

Atlassian Rovo MCP supports OAuth 2.1 and, when enabled by an organization admin, API-token authentication. This connector implementation is intentionally scoped to OAuth/Bearer access tokens so the same credential model can also call the Jira REST fallback.

### Required OAuth scopes

For the implemented capabilities, request only the scopes needed by your deployment. Atlassian documents these classic scopes for the selected MCP tools:

- `read:jira-work`
- `search:jira-work`
- `write:jira-work`
- `read:account`
- `read:me`

Existing Jira permissions still apply. Scopes do not elevate the authenticated user beyond Jira project permissions.

For a read-only deployment, omit write permissions in the Atlassian authorization policy and do not configure `JIRA_APPROVAL_SECRET`.

## Environment variables

```text
ATLASSIAN_ACCESS_TOKEN=
ATLASSIAN_MCP_URL=https://mcp.atlassian.com/v1/mcp/authv2
JIRA_ALLOWED_CLOUD_IDS=
JIRA_ALLOWED_PROJECT_KEYS=
JIRA_APPROVAL_SECRET=
```

`ATLASSIAN_MCP_URL` is validated and must remain on the official `mcp.atlassian.com` HTTPS host under `/v1/mcp`.

`JIRA_ALLOWED_CLOUD_IDS` and `JIRA_ALLOWED_PROJECT_KEYS` are comma-separated optional allowlists. When configured, the connector fails closed for resources outside them.

For JQL searches with a project allowlist, the JQL must explicitly contain `project = KEY` clauses and every detected project must be allowed. This intentionally rejects broad cross-project searches instead of guessing user intent.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm start
```

For local development:

```bash
npm run dev
```

The external MCP transport is stdio. Any MCP client that supports launching a local stdio server can use the package when configured with the required environment variables. Client-specific configuration syntax is intentionally not hard-coded here.

## Supported tools

| Tool | Upstream | Risk | Approval | Purpose |
| --- | --- | --- | --- | --- |
| `jira.resources.list` | Rovo MCP `getAccessibleAtlassianResources` | READ | No | Discover accessible Atlassian Cloud resources and `cloudId` values |
| `jira.project.list` | Rovo MCP `getVisibleJiraProjects` | READ | No | List visible Jira projects |
| `jira.issue.search` | Rovo MCP `searchJiraIssuesUsingJql` | READ | No | Search issues using bounded JQL |
| `jira.issue.get` | Rovo MCP `getJiraIssue` | READ | No | Read a Jira issue |
| `jira.issue.transitions.list` | Rovo MCP `getTransitionsForJiraIssue` | READ | No | Inspect valid workflow transitions |
| `jira.comment.add` | Rovo MCP `addCommentToJiraIssue` | WRITE | Yes | Add a public Jira issue comment |
| `jira.issue.create` | Jira REST API v3 | WRITE | Yes | Create an issue without blindly retrying a POST |
| `jira.issue.update` | Rovo MCP `editJiraIssue` | HIGH_RISK | Yes | Update issue fields |
| `jira.issue.transition` | Rovo MCP `transitionJiraIssue` | HIGH_RISK | Yes | Change workflow status |

No delete tool is exposed. No arbitrary REST request tool exists. No Confluence, Compass, JSM, Bitbucket, Teamwork Graph, billing, permission-management, or admin operations are exposed by this connector.

## Approval model

READ tools execute without connector approval after normal authentication and allowlist checks.

WRITE and HIGH_RISK tools require `approvalId`. The connector verifies it against an HMAC generated from the tool name and `JIRA_APPROVAL_SECRET`. The secret stays outside the model context.

Example approval generation outside the agent process:

```bash
node -e "const c=require('node:crypto'); console.log(c.createHmac('sha256', process.env.JIRA_APPROVAL_SECRET).update('jira.issue.create').digest('hex'))"
```

Generate approvals in a trusted operator workflow. Do not disclose `JIRA_APPROVAL_SECRET` to the LLM. For higher-assurance production use, place the same `assertApproval` interface behind a short-lived, single-purpose approval service rather than relying on reusable HMAC values.

### Read -> Recommend -> Prepare -> Execute

A safe workflow is:

1. Read/search Jira automatically.
2. Let the agent recommend the intended change.
3. Present the exact target issue/project and proposed values to a human.
4. Human/operator issues the approval out of band.
5. Connector executes the scoped write.

## Validation and safety

The connector applies:

- Official MCP hostname validation.
- Fixed upstream MCP tool allowlist; it does not dynamically trust newly discovered tools.
- Strict provider-scoped tool names.
- Cloud allowlisting.
- Project allowlisting.
- Jira issue-key validation.
- Bounded JQL length and result limits.
- Bounded field arrays, labels, summaries, descriptions, and approval IDs.
- `customFields` limited to keys matching `customfield_<number>` on issue creation.
- No token-bearing tool arguments.
- No arbitrary URL or arbitrary API executor.
- Provider responses marked as untrusted data.
- Explicit approval for external comments, issue creation, updates, and transitions.
- No destructive operations.

## Issue creation REST fallback

`jira.issue.create` calls:

```text
POST https://api.atlassian.com/ex/jira/{cloudId}/rest/api/3/issue
```

The connector builds standard Jira fields and converts `descriptionText` into a simple Atlassian Document Format paragraph. This avoids accepting raw HTML and avoids asking the model to manufacture unrestricted ADF trees.

The create call is **not retried** automatically. Retrying an ambiguous successful POST can create duplicates. If the network outcome is uncertain, read/search Jira first before attempting another create.

## Reliability and rate limits

The remote MCP call has a 30-second connector timeout. The REST create call has a 20-second timeout.

Atlassian's current Jira Cloud rate-limit model includes points-based hourly quota, per-endpoint burst limits, and per-issue write limits. A `429` should be treated as throttling and callers should honor `Retry-After`.

The REST fallback preserves `retry-after` information in its error and never automatically retries its POST. The connector also does not blindly retry MCP write tools. This is intentional because comment/update/transition calls are not guaranteed to be idempotent from the connector's perspective.

Pagination is intentionally bounded with `maxResults <= 100` for JQL search. Atlassian's hosted MCP behavior may vary by tool/version; callers must not assume an absent pagination token means the full Jira result set was returned.

## Error handling

Common failures include:

- Missing/expired OAuth token.
- Missing Jira scopes.
- User lacks Jira project permission.
- Organization blocks MCP or the connecting domain.
- Cloud/project blocked by local connector allowlists.
- Missing/invalid approval ID.
- Atlassian MCP timeout.
- Jira `429` throttling.
- Jira validation errors for required/custom fields.
- Workflow transition unavailable for the current issue state.

The connector fails closed on configuration errors and does not downgrade to a broader credential or arbitrary endpoint.

## Security considerations

### Prompt injection

Issue summaries, descriptions, comments, user names, labels, and all other provider content are untrusted. The wrapper places provider results under `untrustedProviderData`. Consumers must never treat retrieved Jira text as system/tool instructions or permission changes.

### SSRF

The upstream MCP URL is restricted to the official Atlassian hostname and HTTPS. The REST fallback constructs its host internally and accepts only `cloudId` as a path component.

### Credential isolation

The access token stays in process environment/config and is attached by the connector transport. It is never accepted from an MCP tool call.

### Permission escalation

The connector cannot modify its own scopes, allowlists, approval secret, or Atlassian admin policy through MCP tools. New upstream MCP tools are not automatically exposed.

### Logging

Do not log process environment, Authorization headers, access tokens, full webhook/session secrets, or approval secrets. Provider content can also contain sensitive business data; apply application-level redaction where needed.

## Known upstream limitations

The implementation reflects observed 2026 limitations in Atlassian's official hosted MCP ecosystem:

- Atlassian retired the legacy SSE endpoint after June 30, 2026; use Streamable HTTP.
- Atlassian's official MCP issue tracker has an open report of duplicate Jira issue creation from one `createJiraIssue` call. This connector therefore uses REST for issue creation.
- Another official-repository report describes project-specific `createJiraIssue` rejection while REST succeeds.
- Rich Jira ADF content can be represented as markdown by the hosted MCP. Updating rich-text fields after a lossy read can remove unsupported formatting/media. `jira.issue.update` is therefore HIGH_RISK.
- Some workflow transitions involving sprint fields may require additional Jira Software permissions/scopes beyond the classic Jira work scopes.
- MCP search pagination behavior has had reported limitations. Always bound queries and verify completeness when it matters.

These are upstream constraints; the connector does not pretend they are solved.

## Testing

Unit tests require no live Atlassian credentials and cover:

- Missing authentication configuration.
- Official-host validation.
- Cloud/project allowlist denial.
- Approval enforcement.
- High-risk classification.
- REST create behavior with a mocked provider.
- Credential isolation from the request body.
- `429` / `Retry-After` propagation.
- No automatic POST retry.

Run:

```bash
npm test
```

Live integration tests are intentionally excluded from the default test suite because they require a real Atlassian tenant, OAuth authorization, Jira permissions, and can mutate data.

## Example workflows

### Triage

`jira.issue.search` -> `jira.issue.get` -> `jira.issue.transitions.list`

### Create from approved work

`jira.project.list` -> operator review -> `jira.issue.create`

### Update lifecycle

`jira.issue.get` -> prepare changes -> operator approval -> `jira.issue.update` -> inspect transitions -> operator approval -> `jira.issue.transition`

### Comment after verification

`jira.issue.get` -> prepare comment -> operator approval -> `jira.comment.add`

See `examples/tool-calls.md` for concrete inputs.

## Limitations

- Jira Cloud only; Jira Data Center/Server is not implemented.
- OAuth/Bearer token runtime only; interactive OAuth browser flow is delegated to the surrounding credential provider/client.
- No refresh-token persistence is implemented inside this package.
- No delete operations.
- No attachment upload/download.
- No sprint/board administration.
- No Jira Service Management operations.
- No webhook receiver; Atlassian event ingestion would require a separately hosted HTTP endpoint and signature/security model.
- `jira.issue.update` accepts Jira field values but does not attempt to understand every custom-field schema. Use Jira create metadata/admin knowledge before writing custom fields.

## Reusability

No company, tenant, project, user, issue, or credential is hard-coded. Deployment-specific values are supplied through environment variables and tool inputs, making the package reusable across Jira Cloud projects while keeping the external MCP contract stable.
