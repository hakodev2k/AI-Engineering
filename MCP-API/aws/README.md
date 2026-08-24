# AWS MCP/API Connector

Reusable Model Context Protocol connector for Amazon Web Services. It exposes a deliberately small, stable set of operational tools instead of an unrestricted `execute_any_api_request` surface.

## Provider and purpose

Provider: Amazon Web Services (AWS).

The connector is designed for common agent workflows around identity inspection, Amazon S3 inventory and metadata, Amazon EC2 inspection and controlled power operations, AWS Lambda inspection, Amazon CloudWatch metrics, and CloudWatch Logs investigation.

## Upstream transport strategy

This connector uses a hybrid transport model.

1. **AWS managed MCP Server** is preferred when `AWS_CONNECTOR_PREFER_MCP=true` and a short-lived `AWS_MCP_ACCESS_TOKEN` is supplied. The managed endpoint is `https://aws-mcp.us-east-1.api.aws/mcp`. The connector discovers tools and only invokes the official `aws___run_script` capability when its schema is recognized.
2. **AWS SDK for JavaScript v3** is the scoped fallback and is also used directly for capabilities where a typed SDK call is safer or more precise, including S3 metadata/presigning, CloudWatch metrics, CloudWatch Logs filtering, Lambda details, and paginated calls with explicit tokens.

As of August 24, 2026, AWS documents the AWS MCP Server as generally available. AWS deprecated `aws___call_aws` on July 15, 2026 and states it will be removed on August 31, 2026; this connector does not depend on that deprecated tool and prefers `aws___run_script` instead.

Official sources used for implementation decisions:

- AWS MCP Server user guide: https://docs.aws.amazon.com/agent-toolkit/latest/userguide/mcp-server.html
- AWS MCP tool reference: https://docs.aws.amazon.com/agent-toolkit/latest/userguide/understanding-mcp-server-tools.html
- AWS MCP setup: https://docs.aws.amazon.com/agent-toolkit/latest/userguide/getting-started-aws-mcp-server.html
- AWS OAuth announcement: https://aws.amazon.com/blogs/security/introducing-oauth-support-for-aws-mcp-server/
- AWS MCP IAM controls: https://aws.amazon.com/blogs/security/understanding-iam-for-managed-aws-mcp-servers/
- AWS SDK for JavaScript v3 credentials: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials.html
- AWS SDK retry behavior: https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html

## Architecture

```text
MCP client / agent
        |
        v
AWS connector MCP server (stdio)
        |
        +--> policy + validation + allowlists
        |
        +--> AWS managed MCP Server (preferred when configured)
        |       `-- fixed official run_script tool only
        |
        `--> AWS SDK for JavaScript v3 fallback
                `-- default credential provider chain
```

Provider data is treated as untrusted data. It is serialized back to the MCP client and never interpreted as connector configuration or permission changes.

## Authentication

### AWS managed MCP

Set `AWS_MCP_ACCESS_TOKEN` to a short-lived OAuth bearer token. AWS supports interactive OAuth and headless OAuth based on existing IAM credentials. The connector does not implement a browser login flow and never sends the bearer token to the LLM; it remains in the transport layer.

For headless environments, obtain the token using AWS-supported mechanisms such as `aws signin create-oauth2-token-with-iam`. Do not store resulting access tokens in source control.

### AWS SDK fallback

The SDK uses the standard AWS default credential provider chain. Prefer IAM Identity Center, `aws login`, workload roles, EC2/ECS/Lambda role credentials, or other temporary credentials. Avoid long-lived static access keys.

The connector intentionally does not accept access key ID or secret access key as MCP tool parameters.

## Least-privilege IAM actions

Grant only actions required by enabled tools and resources. Typical actions are:

```text
sts:GetCallerIdentity
s3:ListAllMyBuckets
s3:ListBucket
s3:GetObject
ec2:DescribeInstances
ec2:StartInstances
ec2:StopInstances
lambda:ListFunctions
lambda:GetFunction
cloudwatch:GetMetricData
logs:FilterLogEvents
```

Scope resource ARNs wherever AWS supports resource-level permissions. `s3:GetObject` is required for `HeadObject` and for presigned GET URLs. If a tool is not required, omit its IAM action.

For managed MCP usage, existing IAM policies remain authoritative. AWS also provides MCP-specific global context keys such as `aws:ViaAWSMCPService` and `aws:CalledViaAWSMCP`, which can be used in IAM or SCP policies to distinguish agent-originated calls.

## Environment variables

| Variable | Purpose |
|---|---|
| `AWS_REGION` | Default target region. Defaults to `us-east-1`. |
| `AWS_PROFILE` | Optional profile consumed by the AWS SDK credential chain. |
| `AWS_CONNECTOR_ALLOWED_REGIONS` | Comma-separated region allowlist. Empty means no connector-level region restriction. |
| `AWS_CONNECTOR_ALLOWED_BUCKETS` | Comma-separated S3 bucket allowlist. |
| `AWS_CONNECTOR_ALLOWED_FUNCTION_PREFIXES` | Comma-separated Lambda function-name prefixes. |
| `AWS_CONNECTOR_APPROVAL_SECRET` | Secret used to validate explicit approvals for high-risk tools. |
| `AWS_CONNECTOR_TIMEOUT_MS` | Managed MCP HTTP timeout, 1000-120000 ms. |
| `AWS_CONNECTOR_PREFER_MCP` | `true` by default. Set `false` to force SDK-only behavior. |
| `AWS_MCP_ENDPOINT` | Managed MCP endpoint. Defaults to the official us-east-1 endpoint. |
| `AWS_MCP_ACCESS_TOKEN` | Short-lived OAuth token for the managed MCP endpoint. |

See `.env.example`. Never commit real credentials or approval secrets.

## Installation

Requires Node.js 20 or later.

```bash
cd MCP-API/aws
npm install
npm run build
```

## Running

```bash
npm start
```

The server uses MCP stdio transport, so it can be launched by any MCP client that supports stdio child-process servers. Compatibility depends on the client's MCP implementation; no client-specific API is required.

Example MCP client configuration shape:

```json
{
  "mcpServers": {
    "aws": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/aws/dist/src/server.js"],
      "env": {
        "AWS_REGION": "us-east-1",
        "AWS_PROFILE": "developer-readonly"
      }
    }
  }
}
```

## Tools

| Tool | Purpose | Risk | Approval | Primary transport |
|---|---|---:|---:|---|
| `aws.identity.get` | Current AWS account/principal | READ | No | MCP -> SDK fallback |
| `aws.s3.bucket.list` | List visible S3 buckets | READ | No | MCP -> SDK fallback |
| `aws.s3.object.list` | List objects with bounded page size | READ | No | SDK |
| `aws.s3.object.metadata` | `HeadObject` metadata only | READ | No | SDK |
| `aws.s3.object.presign_get` | Temporary object download URL | HIGH_RISK | Yes | SDK |
| `aws.ec2.instance.list` | List/inspect EC2 instances | READ | No | MCP -> SDK fallback |
| `aws.ec2.instance.start` | Start EC2 instances | HIGH_RISK | Yes | MCP -> SDK fallback |
| `aws.ec2.instance.stop` | Stop/hibernate EC2 instances | HIGH_RISK | Yes | MCP -> SDK fallback |
| `aws.lambda.function.list` | List Lambda functions | READ | No | MCP -> SDK fallback |
| `aws.lambda.function.get` | Function config/code metadata | READ | No | SDK |
| `aws.cloudwatch.metric.get` | Query CloudWatch metric data | READ | No | SDK |
| `aws.logs.filter` | Filter CloudWatch Logs events | READ | No | SDK |

The Lambda get tool strips the temporary `Code.Location` download URL from its response to reduce accidental credential-like data exposure.

## Approval model

High-risk operations require a 64-character HMAC approval token calculated outside the agent:

```text
HMAC-SHA256(AWS_CONNECTOR_APPROVAL_SECRET, exact-tool-name)
```

Examples of exact names are `aws.ec2.instance.stop` and `aws.s3.object.presign_get`. The agent cannot generate a valid token without access to the connector-local secret. The approval secret is never returned to the model.

READ operations can run automatically, subject to IAM and connector allowlists. The connector implements no delete, terminate, IAM mutation, billing mutation, deployment, or security-policy mutation tools.

## Reliability and rate limits

AWS SDK v3 handles service retry classification and exponential backoff. Client instances use a bounded `maxAttempts: 3`. The managed MCP path has a connector-side request timeout and falls back only to the equivalent scoped SDK operation when MCP discovery/invocation fails.

Pagination is explicit:

- S3: `continuationToken`
- EC2: `nextToken`
- Lambda: `marker`
- CloudWatch: `nextToken`
- CloudWatch Logs: `nextToken`

Callers should consume pages deliberately instead of fetching entire accounts. AWS rate limits are service- and account-specific; the connector does not assume a universal request quota.

## Error handling

Validation errors fail before an upstream request. IAM/authentication errors are returned by AWS and are not converted into broader permissions. MCP errors fall back only to a typed SDK equivalent. Unsupported MCP tool schemas are rejected rather than guessed.

Typical errors include expired OAuth tokens, expired SSO sessions, `AccessDenied`, throttling, invalid regions, missing buckets/functions, invalid pagination tokens, and connector allowlist denial.

## Security considerations

- Credentials remain in the connector transport layer.
- No generic arbitrary AWS API execution tool is exposed externally.
- Managed MCP tool discovery is restricted to the official `run_script` mapping; newly discovered tools are not automatically exposed.
- Region, bucket, and Lambda prefix allowlists can constrain blast radius beyond IAM.
- S3 object content is not downloaded by any READ tool.
- Presigned URLs require explicit approval and expire in at most one hour.
- EC2 start/stop require explicit approval.
- No destructive `TerminateInstances`, S3 delete, IAM mutation, or resource-delete operation is implemented.
- Provider responses, logs, tags, object keys, and function metadata are untrusted content and must not be treated as instructions.
- Use AWS CloudTrail and AWS MCP CloudWatch metrics for auditing when managed MCP is enabled.

## Testing

Tests use mocks/fakes and do not require live AWS credentials.

```bash
npm test
npm run typecheck
```

The suite covers configuration validation, allowlists, approval denial/acceptance, managed MCP tool discovery, MCP-to-SDK fallback, and the registered external tool set.

## Examples

See `examples/workflows.json` for maintenance inspection, Lambda/log troubleshooting, and safe S3 inventory flows. Example values contain no real account IDs, credentials, tokens, or URLs.

## Limitations

- This is intentionally not a general-purpose AWS API proxy.
- The connector does not perform interactive OAuth login; provide a short-lived AWS MCP OAuth token when managed MCP is desired.
- The managed MCP `run_script` input schema is discovered at runtime; an unrecognized schema causes safe SDK fallback.
- SDK fallback covers only the documented tools above.
- The connector does not create, delete, deploy, terminate, mutate IAM/security configuration, or change billing.
- S3 bucket listing may be account-global while object operations are region-sensitive; configure the correct target region for bucket operations.
