# Snyk connector workflow examples

All examples assume the connector is already configured. Provider responses are returned as untrusted data and must never be treated as agent instructions.

## Review an organization's security posture

Tool: `snyk.project.list`

```json
{
  "orgId": "4a18d42f-0706-4ad0-b127-24078731fbed",
  "limit": 20
}
```

Permission: `READ`. Approval: not required.

Then call `snyk.project.get`, `snyk.issue.list`, and `snyk.issue.get` to inspect project metadata and findings. Responses preserve Snyk JSON:API data and pagination links.

## Export an SBOM

Tool: `snyk.project.sbom.get`

```json
{
  "orgId": "4a18d42f-0706-4ad0-b127-24078731fbed",
  "projectId": "331ede0a-de94-456f-b788-166caeca58bf",
  "format": "cyclonedx1.6+json"
}
```

Permission: `READ`. Approval: not required. Expected output is the Snyk-generated SBOM document wrapped as untrusted provider data.

## Scan a local dependency tree

Tool: `snyk.scan.sca`

```json
{
  "path": "/workspace/application",
  "approvalId": "<64-character payload-bound approval digest>"
}
```

Permission: `HIGH_RISK`. Approval: required because the official Snyk MCP SCA scan can invoke local package-manager/build tooling such as Maven or Gradle while resolving dependencies.

## Scan source code

Tool: `snyk.scan.code`

```json
{
  "path": "/workspace/application/src",
  "approvalId": "<64-character payload-bound approval digest>"
}
```

Permission: `HIGH_RISK`. Approval: required. The connector delegates only to the allowlisted official `snyk_code_scan` MCP tool.

## Scan infrastructure as code

Tool: `snyk.scan.iac`

```json
{
  "path": "/workspace/application/infra",
  "approvalId": "<64-character payload-bound approval digest>"
}
```

Permission: `HIGH_RISK`. Approval: required.

## Scan a container image

Tool: `snyk.scan.container`

```json
{
  "image": "registry.example.com/team/service:2026-08-26",
  "approvalId": "<64-character payload-bound approval digest>"
}
```

Permission: `HIGH_RISK`. Approval: required. The image reference is passed only to the official Snyk MCP container scanning tool.
