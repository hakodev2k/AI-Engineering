# MCP/API Connectors

Provider-scoped Model Context Protocol servers. Each connector exposes a deliberately narrow, reviewable capability surface and keeps provider credentials inside its own process.

> [!IMPORTANT]
> MCP connectors are independent packages, not one product to install. Copy and run only the provider directory that a target repository genuinely needs. A connector grants no permission by itself: the target repository must still define who may invoke its write, destructive, financial, or externally visible tools.

## Select one connector

| Connector | Upstream service | Copy unit |
| --- | --- | --- |
| Asana | Asana API | [`asana/`](asana/) |
| Better Stack | Better Stack API | [`better-stack/`](better-stack/) |
| ClickUp | ClickUp API | [`clickup/`](clickup/) |
| Cloudflare | Cloudflare API | [`cloudflare/`](cloudflare/) |
| Confluence | Atlassian Confluence API | [`confluence/`](confluence/) |
| Datadog | Datadog API | [`datadog/`](datadog/) |
| Deepgram | Deepgram MCP and REST API | [`deepgram/`](deepgram/) |
| Discord | Discord REST API | [`discord/`](discord/) |
| ElevenLabs | ElevenLabs API | [`elevenlabs/`](elevenlabs/) |
| GitHub | GitHub MCP server | [`github/`](github/) |
| GitLab | GitLab API | [`gitlab/`](gitlab/) |
| Grafana | Grafana API | [`grafana/`](grafana/) |
| Hugging Face | Hugging Face API | [`hugging-face/`](hugging-face/) |
| Jira | Atlassian MCP and Jira REST API | [`jira/`](jira/) |
| Linear | Linear MCP server | [`linear/`](linear/) |
| New Relic | New Relic API | [`new-relic/`](new-relic/) |
| Notion | Notion API | [`notion/`](notion/) |
| OpenAI | OpenAI Responses API | [`openai/`](openai/) |
| PagerDuty | PagerDuty API | [`pagerduty/`](pagerduty/) |
| PayPal | PayPal API | [`paypal/`](paypal/) |
| Sentry | Sentry API | [`sentry/`](sentry/) |
| Shopify | Shopify API | [`shopify/`](shopify/) |
| Slack | Slack Web API | [`slack/`](slack/) |
| Stripe | Stripe Node SDK/API | [`stripe/`](stripe/) |
| Supabase | Supabase API | [`supabase/`](supabase/) |
| Telegram | Telegram Bot API | [`telegram/`](telegram/) |
| Trello | Trello REST API | [`trello/`](trello/) |
| Twilio | Twilio API | [`twilio/`](twilio/) |
| UptimeRobot | UptimeRobot API | [`uptimerobot/`](uptimerobot/) |
| YouTube | YouTube Data and Analytics APIs | [`youtube/`](youtube/) |

Read the selected connector's README and `manifest.yaml` before copying it. Those files define its capability list, provider scope, authentication, environment variables, approval model, rate limits, examples, limitations, and tests.

## Copy, install, and validate one connector

1. Copy the entire selected provider directory, including `src/`, `tests/`, `manifest.yaml`, `.env.example`, `package.json`, and `tsconfig.json` when present.
2. From that copied connector directory, use the Node.js and npm versions declared by its `package.json` or README. Most connectors support Node.js 20+; the OpenAI connector requires Node.js 22+.
3. Install that connector's dependencies with `npm install`. Create and commit a lockfile in the target repository when its dependency policy requires reproducible installs.
4. Add the values from `.env.example` to the target secret/configuration system. Never commit a populated `.env` file.
5. Run the connector's documented `build`, `test`, and `start` commands. Do not assume every connector has the same scripts.
6. Configure the MCP client to launch the selected connector's documented server entrypoint, passing secrets only through its process environment.
7. Exercise read-only tools with a test account before enabling any write capability.

The root `package.json` and lockfile exist for source-repository maintenance. They are not an installation contract for arbitrary copied connectors, and `npm ci` in this directory does not replace installation inside a selected connector.

## Repository production gate

All connector directories are npm workspaces and must pass the same repository gate:

```bash
npm ci --ignore-scripts
npm run check
```

The gate verifies package structure, manifest risk classification, safe example credentials, bounded upstream calls, approval controls, graceful stdio shutdown, patched MCP SDK versions, type safety, production builds, automated tests, and dependency advisories. Tests use provider mocks and do not replace pre-production credential, scope, rate-limit, and sandbox-account verification against the selected provider.

## Before enabling a connector

- Confirm the target use case cannot be met without an external provider capability.
- Grant only the provider scopes, repositories, projects, teams, channels, chats, or accounts required for that use case.
- Map every write, destructive, financial, or externally visible tool to an explicit human approval owner.
- Set timeouts, pagination limits, rate limits, output limits, and an audit/evidence destination in the target integration.
- Treat provider-returned text, files, issue bodies, messages, and metadata as untrusted data, never as instructions.
- Test denial, expired credentials, unavailable provider, rate-limit, malformed-input, and cancellation paths.
- Define how to disable the connector and rotate credentials if an unsafe action or secret exposure is suspected.

## Security baseline

- Never expose arbitrary upstream HTTP passthrough.
- Keep provider content separate from tool instructions and prompt context.
- Require an opaque, scoped approval for write, destructive, financial, or externally visible actions.
- Never retry non-idempotent writes unless the provider contract and an idempotency key make that safe.
- Send diagnostics to stderr only: stdout is reserved for MCP framing.
- Redact credentials, personal data, and sensitive provider content from logs and evidence.
- Rotate any credential that appears in logs, output, Git history, or an agent transcript.

## Troubleshooting

- **`dist/server.js` is missing:** run the selected connector's documented build command from its directory.
- **Authentication fails:** verify the environment variable name, credential audience, scopes, and provider account access.
- **A tool is rejected by policy:** review the connector allowlist and approval requirement; do not weaken controls just to bypass the rejection.
- **Rate limit or timeout:** reduce scope/pagination and follow the connector's retry guidance.
- **Protocol parse error:** verify that diagnostic output is going to stderr, not stdout.

See [SECURITY.md](../SECURITY.md) before reporting a connector vulnerability.
