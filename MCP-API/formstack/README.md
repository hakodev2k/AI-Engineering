# Formstack MCP/API Connector

Reusable MCP server for Formstack Forms. It exposes a narrow set of form, field, submission, and webhook operations through stable MCP tools while keeping the Formstack Personal Access Token inside the connector process.

## Upstream transport

Formstack does not document an official MCP server. This connector therefore uses the official Formstack Forms REST API V2025 directly and exposes its selected capabilities through a local MCP stdio server.

Official sources used for this implementation:

- API overview and authentication: https://developers.formstack.com/reference/api-overview
- Forms: https://developers.formstack.com/reference/forms
- Fields: https://developers.formstack.com/reference/createfieldinform-1
- Submissions: https://developers.formstack.com/reference/submissions
- Form submission listing: https://developers.formstack.com/reference/getformsubmissionslist-1
- Webhooks: https://developers.formstack.com/reference/webhook
- Webhook creation: https://developers.formstack.com/reference/createwebhook-1

The V2025 API uses JSON and Personal Access Tokens. Formstack states that PATs inherit the permissions of the Formstack user who created them. Use a dedicated least-privilege user whenever possible.

## Architecture

```text
MCP client
  -> MCP stdio server
     -> permission / approval policy
        -> validated tool handler
           -> FormstackClient
              -> Bearer PAT from process environment
                 -> Formstack Forms API V2025
```

Provider responses are wrapped with `untrusted_data: true`. Formstack-returned text and submission content must be treated as data, never as instructions.

## Authentication

Create a Formstack Personal Access Token from the Formstack Administration application and supply it only through the connector environment:

```bash
export FORMSTACK_ACCESS_TOKEN='fs_pat_...'
```

Do not paste the token into prompts or tool arguments. The connector sends it only in the upstream `Authorization: Bearer ...` header.

Required environment variable:

- `FORMSTACK_ACCESS_TOKEN`

Optional environment variables:

- `FORMSTACK_API_BASE` — defaults to `https://www.formstack.com/api/v2025`; HTTPS is required.
- `FORMSTACK_REQUEST_TIMEOUT_MS` — defaults to `15000`, allowed range 1000–60000.
- `FORMSTACK_REQUIRE_WRITE_APPROVAL` — defaults to `true`.
- `FORMSTACK_DESTRUCTIVE_ENABLED` — defaults to `false`.

See `.env.example`.

## Installation

Requires Node.js 20 or later.

```bash
npm install
npm run build
npm test
```

Run the MCP server:

```bash
npm start
```

The server uses stdio transport. Configure an MCP client to launch `node dist/server.js` from this connector directory and provide credentials through the process environment.

## Tools

| Tool | Purpose | Risk | Approval |
| --- | --- | --- | --- |
| `formstack.form.list` | List/search forms | READ | No |
| `formstack.form.get` | Read form details and optionally fields | READ | No |
| `formstack.form.create` | Create a form | WRITE | Configurable; required by default |
| `formstack.form.update` | Update common form settings | WRITE | Configurable; required by default |
| `formstack.form.delete` | Permanently delete a form | DESTRUCTIVE | Required; disabled by default |
| `formstack.field.list` | List form fields | READ | No |
| `formstack.field.create` | Create a field | WRITE | Configurable; required by default |
| `formstack.field.update` | Update a field | WRITE | Configurable; required by default |
| `formstack.field.delete` | Permanently delete a field | DESTRUCTIVE | Required; disabled by default |
| `formstack.submission.list` | List/search form submissions | READ | No |
| `formstack.submission.get` | Read one submission | READ | No |
| `formstack.submission.delete` | Permanently delete submission data | DESTRUCTIVE | Required; disabled by default |
| `formstack.webhook.list` | List form webhooks | READ | No |
| `formstack.webhook.create` | Create an external submission webhook | HIGH_RISK | Always required |
| `formstack.webhook.delete` | Remove a webhook | DESTRUCTIVE | Required; disabled by default |

The connector deliberately does not expose a generic HTTP request tool.

## Permission and approval model

`READ` operations can run automatically. `WRITE` operations require `approved=true` by default and may only be relaxed by setting `FORMSTACK_REQUIRE_WRITE_APPROVAL=false` in a trusted host policy. `HIGH_RISK` operations always require approval. `DESTRUCTIVE` operations require both `FORMSTACK_DESTRUCTIVE_ENABLED=true` and `approved=true`.

An agent cannot change these environment controls through MCP tools.

Webhook creation is considered HIGH_RISK because it causes future submission data to leave Formstack. The connector requires HTTPS and rejects localhost, `.local`, link-local, and RFC1918 IPv4 destinations to reduce SSRF and accidental internal-data routing risk.

## Rate limits and reliability

Formstack documents daily rate limits per Personal Access Token, with limits varying by account plan and `429 Too Many Requests` returned when the quota is exceeded. The connector preserves the upstream error and honors `Retry-After` when present.

Read-only GET requests use at most three attempts for transient `429` or `503` responses with bounded delay. Writes and destructive operations are never blindly retried, preventing duplicate forms, duplicate fields, or repeated destructive actions.

All requests have a configurable timeout. Authentication, permission, validation, and other non-transient provider failures are returned without retry.

## Pagination

`formstack.form.list` and `formstack.submission.list` expose bounded page inputs. Submission listing supports `pageNumber`, `pageSize`, order, keyword filtering, time filtering, and selected response-shaping flags. Callers should page intentionally rather than attempting to retrieve an entire account in one request.

## Error handling

The connector maps provider and transport failures to MCP tool errors without exposing credentials. Common cases include:

- `401`: invalid/expired token or encrypted submission data requiring provider-side credentials not exposed by this connector.
- `403`: the PAT's Formstack user lacks permission.
- `404`: resource not found.
- `429`: daily API quota exceeded.
- `503`: temporary upstream unavailability.
- timeout/network failure: returned as a bounded connector error.

Diagnostics should never log PATs or raw sensitive submission content.

## Security considerations

- Use a dedicated least-privilege Formstack user/PAT.
- Keep PATs in a secret manager or process environment.
- Treat form names, labels, submission data, webhook metadata, and any other provider content as untrusted input.
- Keep `FORMSTACK_DESTRUCTIVE_ENABLED=false` unless destructive workflows have an explicit owner and audit process.
- Review every webhook destination before approval; webhook delivery can disclose submitted personal data.
- Do not forward retrieved Formstack content into system instructions or permission decisions.
- Rotate any token exposed in logs, Git history, chat transcripts, or issue content.
- Formstack form encryption passwords are intentionally not accepted as MCP tool parameters by this connector, to avoid moving extra decryption secrets through agent-visible calls.

## Examples

See `examples/workflows.md` for read, write, webhook, and destructive workflows with expected output shape and approval requirements.

## Testing

Unit tests require no live Formstack credentials. They cover:

- required authentication configuration;
- HTTPS API-base validation;
- write approval denial/allow;
- destructive default denial;
- webhook SSRF-style destination checks;
- registration of all 15 MCP tools;
- bearer authorization on upstream requests;
- successful response parsing;
- bounded read retry on throttling;
- no automatic retry of writes.

Run:

```bash
npm test
npm run build
```

## Limitations

This connector intentionally implements only high-value Forms workflows. It does not expose every Formstack V2025 endpoint, SCIM, Documents, Sign, billing, account administration, subaccount administration, notification-email creation, arbitrary submit actions, file upload/decryption secrets, or generic API passthrough.

No official Formstack MCP server was identified in the current official Formstack developer documentation; upstream transport is therefore REST only. If Formstack later publishes an official MCP server, each capability should be reassessed individually rather than automatically trusting newly discovered tools.

Normal operation requires a Formstack account and PAT with permissions matching the requested resource. Destructive calls should be exercised only in a non-production Formstack account before production use.
