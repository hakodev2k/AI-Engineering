# Semgrep MCP/API Connector

Reusable, policy-enforcing MCP facade over **Semgrep's official Guardian MCP server**. The connector exposes a stable `semgrep.*` tool namespace, validates inputs before they reach the upstream server, keeps credentials in the connector environment, and rejects upstream tools outside a fixed allowlist.

## Transport strategy

Semgrep has an official MCP server in the main `semgrep/semgrep` repository. Current official source registers tools for rule schema retrieval, supported languages, AppSec findings, content/local scans, custom-rule scans, AST parsing, Supply Chain scans, and identity. The official CLI launches it with `semgrep mcp` and supports stdio plus streamable HTTP. This connector uses the official **local stdio MCP** transport for every implemented capability; no unofficial MCP server and no generic REST proxy are used.

The connector does not implement provider-side write operations. That keeps the surface appropriate for unattended analysis while preserving the user-required approval boundary: there are no hidden triage, token, policy, project, or deletion mutations.

## Official sources researched

- Semgrep Guardian / MCP source: https://github.com/semgrep/semgrep/tree/develop/cli/src/semgrep/mcp
- Guardian MCP README and launch instructions: https://github.com/semgrep/semgrep/blob/develop/cli/src/semgrep/mcp/README.md
- Semgrep MCP server registration source: https://github.com/semgrep/semgrep/blob/develop/cli/src/semgrep/mcp/server.py
- Semgrep Guardian product page: https://semgrep.dev/products/semgrep-guardian/
- Semgrep documentation: https://semgrep.dev/docs/
- Token settings: https://semgrep.dev/orgs/-/settings/tokens/api

As of September 9, 2026, Semgrep Guardian is the current official MCP path. The older standalone `semgrep/mcp` repository is archived; this connector therefore targets the MCP implementation shipped in the main Semgrep CLI instead.

## Architecture

`MCP client -> this connector -> strict schema/limits -> fixed upstream allowlist -> semgrep mcp (stdio) -> Semgrep engine/AppSec Platform`

Raw credentials are never part of tool inputs or responses. `SEMGREP_APP_TOKEN`, when needed, is inherited only by the child Semgrep MCP process.

## Requirements and installation

- Python 3.11+
- Semgrep CLI version that contains `semgrep mcp`

```bash
python -m venv .venv
. .venv/bin/activate
pip install -e '.[test]'
semgrep mcp --help
semgrep-connector
```

The connector itself serves MCP over stdio. Configure any MCP client that can launch a local stdio command to run `semgrep-connector` with the environment values described below.

## Authentication

Local engine tools do not require a Semgrep AppSec token. The two uploaded-findings tools require `SEMGREP_APP_TOKEN`. Generate the token in Semgrep AppSec Platform and grant only the role/permissions required to read findings. The official MCP source enforces its own identity/role checks for findings; the connector additionally refuses these calls when no token is configured.

Environment variables:

| Variable | Required | Purpose |
|---|---:|---|
| `SEMGREP_APP_TOKEN` | only for findings | AppSec Platform API token, never exposed to the model |
| `SEMGREP_BINARY` | no | command name, default `semgrep`; paths are rejected |
| `SEMGREP_UPSTREAM_TIMEOUT_SECONDS` | no | bounded MCP initialization/call timeout, 5–600, default 120 |
| `SEMGREP_MAX_CODE_BYTES` | no | maximum aggregate code payload, default 500000 |
| `SEMGREP_MAX_FILES` | no | maximum files per scan, default 50 |

## Tools

| Tool | Upstream official tool | Risk | Approval | Purpose |
|---|---|---|---|---|
| `semgrep.language.list` | `get_supported_languages` | READ | no | supported language discovery |
| `semgrep.rule.schema.get` | `semgrep_rule_schema` | READ | no | retrieve rule schema |
| `semgrep.scan.content` | `semgrep_scan_remote` | READ | no | scan in-memory files |
| `semgrep.scan.local_files` | `semgrep_scan` | READ | no | scan validated absolute local files |
| `semgrep.scan.custom_rule` | `semgrep_scan_with_custom_rule` | READ | no | run one explicit YAML rule against code |
| `semgrep.ast.get` | `get_abstract_syntax_tree` | READ | no | get Semgrep AST |
| `semgrep.finding.code.list` | `semgrep_findings` / SAST | READ | no | query uploaded Code findings |
| `semgrep.finding.supply_chain.list` | `semgrep_findings` / SCA | READ | no | query uploaded Supply Chain findings |
| `semgrep.scan.supply_chain` | `semgrep_scan_supply_chain` | READ | no | scan dependency state in active workspace |

The connector deliberately does **not** expose `semgrep_whoami` because the official source documents that local stdio does not support its JWT requirement. It also does not expose any arbitrary upstream tool invocation.

## Validation and security

- Provider content and findings must be treated as untrusted data, never system instructions.
- The upstream MCP tool set is a compile-time allowlist; newly discovered tools are not automatically trusted.
- Content scans reject directory traversal paths and enforce file-count/byte limits.
- Local scans accept only existing absolute files and never accept directory paths.
- Findings require explicit `owner/repository` identifiers and bounded limits.
- The configured Semgrep executable is restricted to a command name, preventing a caller from turning configuration into an arbitrary filesystem executable path.
- Secrets are inherited by the subprocess only and are never accepted in MCP tool arguments.
- No destructive or state-mutating provider actions are implemented.

## Reliability and rate limits

Upstream initialization and calls have a configurable hard timeout. Transport failures are mapped to a connector error rather than silently falling back to an untrusted implementation. The connector makes one upstream MCP call per external tool call and does not perform hidden pagination. Findings are bounded to 100 records per call.

Semgrep does not publish one universal rate-limit number that applies to every AppSec endpoint and plan in the sources used for this connector. The implementation therefore does not invent a fixed quota. Provider-side throttling is returned through the official MCP server. Because every implemented operation is read/analysis-only, the connector does not retry tool calls automatically; callers can retry after the provider's indicated backoff without risking duplicated mutations.

## Errors

Configuration errors fail at startup. Invalid tool inputs fail before contacting Semgrep. Missing `SEMGREP_APP_TOKEN` fails findings calls explicitly. Upstream MCP startup, timeout, connection, and tool errors are surfaced without leaking credentials or full environment data.

## Testing

```bash
pip install -e '.[test]'
pytest
```

Normal tests require no live Semgrep token and cover authentication configuration, traversal validation, upstream allowlisting, payload limits, findings bounds, and local-path validation. Live provider integration tests are intentionally excluded from the default suite.

## Limitations

- Semgrep CLI must already be installed; this package does not download executables at runtime.
- Supply Chain scanning depends on the workspace semantics of the official local MCP server.
- AppSec findings availability depends on the Semgrep plan, deployment, token role, and repositories visible to that token.
- The official Guardian MCP is under active development, so upgrades should be reviewed before deployment.
- This connector intentionally implements only read/analysis workflows; organization administration, API-token management, policy editing, triage mutation, and other state changes are unsupported.
