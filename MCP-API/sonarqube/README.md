# SonarQube MCP Connector

Reusable policy-enforcing MCP facade over the **official SonarSource SonarQube MCP Server**. It provides stable provider-scoped tools for project discovery, issues, branches, pull requests, quality gates, security hotspots, measures, metrics, rules, languages, and duplications.

## Transport strategy and official sources

As verified on 2026-09-06, SonarSource publishes the first-party `sonarsource/sonarqube-mcp` server for SonarQube Cloud and Server. The official project documents stdio/HTTP modes and toolsets covering every capability implemented here. SonarQube MCP Server 1.26.0 was announced on 2026-08-31; this connector pins image `1.26.0.4269` by default for reproducibility.

Official sources:
- https://github.com/SonarSource/sonarqube-mcp-server
- https://mcp.sonarqube.com/
- https://community.sonarsource.com/t/sonarqube-mcp-server-1-26-smarter-issue-triage-new-code-filtering-and-a-security-fix/187857
- https://docs.sonarsource.com/sonarqube-cloud/advanced-setup/web-api/

Because the required capabilities are supported by the trusted first-party MCP server, no REST fallback is necessary. The facade fails closed if required upstream tools disappear rather than silently switching transports.

## Architecture

`MCP client → this stdio server → strict validation + policy → official SonarSource MCP container → SonarQube`

No generic MCP passthrough or arbitrary API-request tool is exposed. At connection time the wrapper discovers upstream tools and verifies its fixed allowlist.

## Authentication

Set `SONARQUBE_TOKEN` to a SonarQube user token with least privilege. `SONARQUBE_ORG` optionally scopes Cloud. `SONARQUBE_PROJECT_KEY` optionally supplies a default project. `SONARQUBE_URL` defaults to `https://sonarcloud.io`; Cloud US and self-hosted deployments can provide the appropriate HTTPS URL.

The token remains in connector process environment and is inherited by Docker through `-e SONARQUBE_TOKEN`; it never appears in tool arguments, schemas, outputs, approval fingerprints, or examples. `SONARQUBE_UPSTREAM_IMAGE` accepts only `sonarsource/sonarqube-mcp:<tag>`.

## Tool list

| External MCP tool | Official upstream tool | Risk |
|---|---|---|
| `sonarqube.project.search` | `search_my_sonarqube_projects` | READ |
| `sonarqube.branch.list` | `list_branches` | READ |
| `sonarqube.pull_request.list` | `list_pull_requests` | READ |
| `sonarqube.issue.search` | `search_sonar_issues_in_projects` | READ |
| `sonarqube.issue.status.change` | `change_sonar_issue_status` | WRITE |
| `sonarqube.security_hotspot.search` | `search_security_hotspots` | READ |
| `sonarqube.security_hotspot.get` | `show_security_hotspot` | READ |
| `sonarqube.security_hotspot.status.change` | `change_security_hotspot_status` | HIGH_RISK |
| `sonarqube.measure.get` | `get_component_measures` | READ |
| `sonarqube.metric.search` | `search_metrics` | READ |
| `sonarqube.quality_gate.status.get` | `get_project_quality_gate_status` | READ |
| `sonarqube.quality_gate.list` | `list_quality_gates` | READ |
| `sonarqube.rule.get` | `show_rule` | READ |
| `sonarqube.language.list` | `list_languages` | READ |
| `sonarqube.duplication.file.search` | `search_duplicated_files` | READ |
| `sonarqube.duplication.get` | `get_duplications` | READ |

Administrative system tools, project deletion, webhook mutation, source retrieval, raw upstream calls, Vortex/IDE analysis, and unnecessary capabilities are excluded.

## Permission and approval model

READ calls execute automatically. WRITE calls require approval by default and can be configured with `SONARQUBE_REQUIRE_WRITE_APPROVAL=false`. HIGH_RISK calls always require exact human approval because security-hotspot resolution changes security triage. Approvals are connector-side in `SONARQUBE_APPROVED_ACTIONS`, for example `sonarqube.issue.status.change:<issueKey>:<status>` and `sonarqube.security_hotspot.status.change:<hotspotKey>:<status>:<resolution>`. An agent cannot self-approve through tool input.

## Installation and running

Prerequisites: Node.js 20+, Docker available as `docker`, network access to SonarQube, and a user token.

```bash
cp .env.example .env
npm install
npm run build
npm test
npm start
```

The server uses MCP stdio and can be launched by standards-compatible stdio MCP clients. Client-specific compatibility is not claimed.

## Reliability, rate limits, and errors

The connector applies a bounded per-call timeout and validates the first-party upstream tool inventory. It does not retry mutating calls. Common authentication, authorization and throttling failures are mapped to stable errors. Pagination inputs are bounded to 500 items; duplication search forces bounded pagination instead of automatic all-page collection. SonarQube quotas vary by product/deployment, so this package does not invent a numeric rate limit.

## Security considerations

Credentials are isolated from the LLM. The SonarQube URL must be HTTPS without embedded credentials. The upstream container image is restricted to SonarSource. Only a fixed MCP tool allowlist is reachable, so newly discovered tools are not trusted automatically. Retrieved issues, rules and analysis output are untrusted data rather than instructions. Security-hotspot status changes are HIGH_RISK. Source-code and system-administration toolsets are not enabled.

## Testing

`npm test` compiles TypeScript and runs configuration, unsafe URL/image rejection, tool registration, validation, pagination, write-denial and high-risk approval tests. Unit tests require no live credentials or Docker daemon.

## Limitations

Runtime use requires Docker for the official stdio upstream. No Web API fallback is implemented because every selected operation is currently covered by first-party MCP. If the pinned server changes incompatibly, the connector fails closed. Webhooks/events, administration, destructive project operations, source retrieval, portfolios, Vortex, IDE bridge analysis and dependency-risk workflows are outside this bounded surface.
