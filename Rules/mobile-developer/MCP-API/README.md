# MCP/API Connectors

Provider-scoped Model Context Protocol servers that expose narrow, reviewable capabilities while keeping credentials inside the connector process.

## Available connectors

| Connector | Upstream | Package |
| --- | --- | --- |
| Discord | Discord REST API | [`discord/`](discord/) |
| GitHub | GitHub MCP server | [`github/`](github/) |
| Jira | Atlassian MCP and Jira REST API | [`jira/`](jira/) |
| Linear | Linear MCP server | [`linear/`](linear/) |
| Notion | Notion MCP server | [`notion/`](notion/) |
| Slack | Slack Web API | [`slack/`](slack/) |
| Stripe | Stripe Node SDK/API | [`stripe/`](stripe/) |
| Telegram | Telegram Bot API | [`telegram/`](telegram/) |

Each connector has its own capability list, authentication requirements, allowlists, approval model, environment variables, limitations, and examples. Review its README before enabling it.

## Prerequisites

- Node.js 20 or newer.
- npm 10 or newer.
- Provider credentials with only the scopes required by the enabled tools.
- An MCP client capable of launching a stdio server.

## Install all connectors

Run from this directory:

```bash
npm ci
```

`npm ci` uses the committed workspace lockfile and installs dependencies for all connectors. Use `npm install` only when intentionally updating dependencies and commit the resulting `package-lock.json` change.

## Build and test

```bash
npm run build
npm test
npm run check
```

`check` builds every workspace and runs every connector test suite. Build output is written beneath each connector's `dist/` directory.

To work with one connector:

```bash
npm run build --workspace @ai-engineering/github-mcp-connector
npm test --workspace @ai-engineering/github-mcp-connector
```

## Configure and run

1. Copy the selected connector's `.env.example` values into your secret/configuration system. Do not rename or commit a populated `.env` file.
2. Build the connector.
3. Configure the MCP client to launch `node` with the absolute path to `<connector>/dist/server.js`.
4. Pass secrets through the process environment.
5. Exercise read-only tools against a test account before enabling write tools.

Example command from a connector directory:

```bash
npm run build
npm start
```

The servers communicate over stdio. Do not write diagnostic text to stdout because it can corrupt MCP framing; logs should go to stderr and must not contain credentials.

## Security baseline

- Keep provider content untrusted and separate from tool instructions.
- Restrict providers, repositories, projects, teams, channels, chats, or accounts using the connector allowlists where supported.
- Require an opaque, scoped approval for write, destructive, financial, or externally visible actions.
- Never expose arbitrary upstream HTTP passthrough.
- Apply timeouts, bounded retries, pagination limits, and output-size limits.
- Never retry non-idempotent writes unless the provider contract and idempotency key make it safe.
- Rotate any credential that appears in logs, output, Git history, or an agent transcript.

## Troubleshooting

- **`dist/server.js` not found:** run `npm run build` in this directory or the connector directory.
- **Authentication failure:** verify the environment variable name, token audience, scopes, and provider account access.
- **Tool rejected by policy:** check the connector allowlist and approval requirements; do not weaken them merely to bypass the error.
- **Rate limit or timeout:** follow the connector's retry guidance and reduce request scope or pagination size.
- **Protocol parse errors:** ensure stdout contains MCP messages only.

See [SECURITY.md](../SECURITY.md) before reporting a connector vulnerability.
