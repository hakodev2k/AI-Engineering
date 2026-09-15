# Veracode MCP/API Connector

Reusable MCP stdio connector for application-security triage using Veracode's official REST APIs. No official Veracode MCP server was identified in current official documentation, so no community MCP dependency is used.

## Official documentation
REST: https://docs.veracode.com/r/c_rest_intro · Applications: https://docs.veracode.com/r/c_apps_intro · Findings: https://docs.veracode.com/r/c_findings_v2_intro · Static flaw info: https://docs.veracode.com/r/c_rest_static_finding_data_path_intro · Auth: https://docs.veracode.com/r/t_install_api_authen · Credentials: https://docs.veracode.com/r/c_api_credentials3 · Rate limits: https://docs.veracode.com/r/About_API_Rate_Limiting · Best practices: https://docs.veracode.com/r/About_Veracode_API_Best_Practices

## Transport and authentication
Node.js 20+, MCP stdio, upstream REST. REST supports HMAC and OAuth Client Credentials; this connector uses OAuth to avoid custom signing. Set `VERACODE_CLIENT_ID`, `VERACODE_CLIENT_SECRET`, `VERACODE_TOKEN_URL`, and the region-appropriate `VERACODE_API_BASE_URL`. Secrets stay in the auth/client layer and never enter MCP arguments. Use an API user and least privilege; Applications access requires appropriate Creator/Security Lead permissions, while Findings commonly requires Results API for API users or Reviewer/Security Lead permissions for UI users.

## Tools and risk
`veracode.application.list`, `veracode.application.get`, `veracode.application.policy.read`, `veracode.sandbox.list`, `veracode.finding.list`, `veracode.finding.get`, `veracode.finding.static_flaw_info`, and `veracode.finding.dynamic_flaw_info` are READ. `veracode.finding.comment` is WRITE and requires explicit `approved=true` by default. The connector deliberately excludes mitigation approval/rejection, scan launch, permission changes, credential administration, and destructive actions.

## Run
```bash
npm install
npm run build
npm test
npm start
```
Point any MCP client with stdio support at `node /absolute/path/dist/src/server.js`. Named-client compatibility depends on that client's stdio MCP support.

## Reliability and rate limits
Veracode documents REST limits of 500 requests/minute/IP. The client honors `Retry-After` on 429, uses bounded exponential backoff for GET/HEAD on 429/5xx (maximum five attempts total), never blindly retries writes, supports request timeout via `VERACODE_TIMEOUT_MS`, and bounds pagination inputs.

## Security
Only relative fixed API paths are accepted; configured endpoints must use HTTPS. There is no arbitrary-request tool. Provider content is untrusted data and must not alter permissions or instructions. Inputs validate UUIDs, enums, ranges, sizes, and comment length. OAuth credentials are isolated from the model. WRITE approval can only be relaxed by operator configuration, not provider content or tool input.

## Errors and tests
Validation/authentication failures are not retried. Provider HTTP errors retain status; 429 retains retry timing. Unit tests use mocked HTTP and cover validation, approval denial/allowance, token isolation, and throttling retry without live credentials.

## Limitations
Focused on application/finding triage. It does not implement Reporting exports, Dynamic Analysis creation, SCA mutation/SBOM upload, XML APIs, webhooks, mitigation decisions, credential management, or destructive operations. Region URLs and entitlements are operator configuration. API response schemas remain provider-owned and are returned as JSON.
